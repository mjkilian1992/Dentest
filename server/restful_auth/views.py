import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import permissions
from serializers import *

LOGGER = logging.getLogger(__name__)

class RegistrationView(APIView):
    """View for handling user registration"""
    def post(self,request,format='json'):
        user = RegistrationSerializer(data=request.data)
        if user.is_valid():
            user.save()
            LOGGER.info("New user %s registered!",user)
            return Response(user.validated_data,status=status.HTTP_201_CREATED)
        return Response(user.errors,status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    """View for handling login with Token authentication. Also checks account has been email-verified."""
    def post(self,request,format='json'):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

class ConfirmEmailView(APIView):
    """View which allows the user to confirm their email"""
    def post(self,request,format='json'):
        serializer = EmailActivationConfirmSerializer(data=request.data)
        if serializer.is_valid():
            LOGGER.info("User %s has confirmed their email.", self.request.user)
            return Response(serializer.validated_data,status=status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class PasswordResetView(APIView):
    """View which allows user to request a password reset email"""
    def post(self,request,format=None):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            LOGGER.info("Password reset requested for user %s", self.request.user)
            serializer.save() # Creates and sends the password reset
            return Response(serializer.validated_data,status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)


class PasswordResetConfirmView(APIView):
    """View which allows user to confirm their password reset, so the password can be changed"""
    def post(self,request,format=None):
        try:
            user = User.objects.get(username=request.data['username'])
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        serializer = PasswordResetConfirmSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            LOGGER.info("Password reset for %s confirmed.",user)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserUpdateView(APIView):
    """View for updating the users profile. If their email is changed it must be confirmed"""
    permission_classes = (permissions.IsAuthenticated,)
    def put(self,request,format='json'):
        # Dont want to allow change of username
        if 'username' in request.data:
            raise ValidationError("Change of username is not allowed")
        serializer = UserModelSerializer(request.user,data=request.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            LOGGER.info("User %s updated their details.",self.request.user)
            return Response(serializer.validated_data,status.HTTP_200_OK)
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)