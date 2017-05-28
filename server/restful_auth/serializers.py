import logging
import traceback
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from rest_framework.authtoken.serializers import AuthTokenSerializer

from subscriptions.subscription_manager import SubscriptionManager

from models import *
from validators import *

EMAIL_UNIQUE = get_setting_with_default('EMAIL_UNIQUE', True)
LOGGER = logging.getLogger(__name__)

class UserModelSerializer(serializers.ModelSerializer):
    """Serializer for Users. Any new fields should be added here"""
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=30,required=True)
    last_name = serializers.CharField(max_length=30,required=True)
    class Meta:
        model = User
        fields = (
            'username',
            'email',
            'first_name',
            'last_name',
        )

    def validate_email(self,email):
        """
        Validates the email by also checking EmailAddress objects.
        If the email is taken and emails are unique an error is raised.
        The exception is if the email entered belongs to the user currently performing an update.
        :param email:
        :return:
        """
        if EmailAddress.objects.filter(email__iexact=email).exclude(user=self.instance).exists() and EMAIL_UNIQUE:
            raise serializers.ValidationError("That email account is already in use.")
        return email

    def update(self, instance, validated_data):
        """Additionally updates the corresponding EmailAddress for the User if it was changed"""
        instance = super(UserModelSerializer,self).update(instance,validated_data)
        email_address = EmailAddress.objects.get(user=instance)
        if validated_data['email'] != email_address.email:
            email_address.change(validated_data['email'])
        return instance

    def create(self,validated_data):
        """Register a new user. Also create a Braintree account for them."""
        username = validated_data.get('username',None)
        email = validated_data.get('email',None)
        password = validated_data.get('password1',None)
        first_name = validated_data.get('first_name',None)
        last_name = validated_data.get('last_name',None)

        try:
            with transaction.atomic():
                user = User.objects.create_user(username,
                                                email=email,
                                                password=password,
                                                first_name=first_name,
                                                last_name=last_name)
                emailaddress = EmailAddress(user=user,email=email)
                user.save()
                emailaddress.save()
                emailaddress.send_confirmation()
                SubscriptionManager.create_new_customer(user)
        except Exception as e:
            logging.exception("Could not register new user.")
            raise serializers.ValidationError(e.message)
        return user


class LoginSerializer(AuthTokenSerializer):
    """Serializer to handle RESFTFUL login. Checks the password provided and gives User their token"""
    password = serializers.CharField(required=True)

    def validate(self,attrs):
        attrs = super(LoginSerializer,self).validate(attrs)
        user = attrs['user']
        # If the user hasnt validated their email, resend a confirmation email and report an error
        email_address = EmailAddress.objects.get(email__iexact=user.email)
        if not email_address.verified:
            email_address.send_confirmation()
            raise serializers.ValidationError("Email address has not been confirmed for this account")
        # Unpack user object
        attrs['username'] = user.username
        attrs['email'] = user.email
        attrs['first_name'] = user.first_name
        attrs['last_name'] = user.last_name

        # Fetch token, or create one if the user doesnt have one for some reason
        token,created = Token.objects.get_or_create(user=user)
        attrs['token'] = token.key

        # Remove user object and password attribute
        attrs.pop('user',None)
        attrs.pop('password',None)
        return attrs


class RegistrationSerializer(UserModelSerializer):
    """Serializer for Users. Can be used for Registration"""
    password1 = serializers.CharField(write_only=True,validators=[
        validate_length,
        common_sequences,
        complexity,
        dictionary_words,
    ])
    password2 = serializers.CharField(write_only=True)

    class Meta(UserModelSerializer.Meta):
        fields = UserModelSerializer.Meta.fields + (
            'password1',
            'password2',
        )

    def validate(self,attrs):
        """In addition to checking user fields are acceptable, need to check passwords match"""
        password1 = attrs.get("password1",None)
        password2 = attrs.get("password2",None)
        if password1 is None or password2 is None:
            raise serializers.ValidationError("One or both passwords field(s) are empty.")
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")
        return attrs




class PasswordResetSerializer(serializers.Serializer):
    """Sends the user a password reset email if they fill in their details correctly"""
    username = serializers.CharField(required=True)
    class Meta:
        fields = (
            'username',
        )

    def validate(self,attrs):
        """Checks all user data is entered correctly, then sends password"""
        try:
            user = User.objects.get(username=attrs['username'])
        except ObjectDoesNotExist:
            raise serializers.ValidationError('Username entered is wrong or does not exist.')
        return attrs

    def create(self,validated_data):
        """Create a new password reset request"""
        user = User.objects.get(username=validated_data['username'])
        try:
            with transaction.atomic():
                reset = PasswordReset.create(user=user)
                reset.save()
                reset.send()
        except Exception as e:
            LOGGER.exception("Could not create a password reset for user %s", user)
            raise serializers.ValidationError(e.message)
        return reset


class EmailActivationConfirmSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    key = serializers.CharField(required=True)

    def validate(self,attrs):
        """Will confirm the password reset if the key and username provided match"""
        try:
            user = User.objects.get(username=attrs['username'])
            email_address = EmailAddress.objects.get(user=user)
            confirmation = EmailConfirmation.objects.get(email_address=email_address)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        if not confirmation.confirm_email(attrs['key']):
            raise serializers.ValidationError('Key is incorrect, expired or has already been used.')
        return attrs


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Given a valid key, username and double-typed password change the user's password to the new one.
    """
    username = serializers.CharField(required=True)
    key = serializers.CharField(required=True)
    password1 = serializers.CharField(write_only=True,validators=[
        validate_length,
        common_sequences,
        complexity,
        dictionary_words,
    ])
    password2 = serializers.CharField(write_only=True)

    def validate(self,attrs):
        """
        Will confirm the password reset if the key and username provided match
        and the passwords entered are valid and match
        """
        password1 = attrs.get("password1",None)
        password2 = attrs.get("password2",None)
        key = attrs.get("key",None)

        if password1 is None or password2 is None:
            raise serializers.ValidationError("One or both passwords field(s) are empty.")
        if password1 != password2:
            raise serializers.ValidationError("Passwords do not match.")
        if key is None:
            raise serializers.ValidationError("Password reset key not provided to serializer")
        try:
            user = User.objects.get(username=attrs['username'])
            reset = PasswordReset.objects.get(user=user,key=key)
        except ObjectDoesNotExist:
            raise serializers.ValidationError("User does not exist or has not requested a password reset.")
        if not reset.confirm(attrs['key']):
            raise serializers.ValidationError('Key is incorrect, expired or has already been used.')

        return attrs

    def update(self,instance,validated_data):
        """Changes the users password"""
        instance.set_password(validated_data['password1'])
        instance.save()
        return instance




