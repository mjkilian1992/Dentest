__author__ = 'mkilian'
from django.contrib.auth.models import User
from django.contrib.auth.backends import ModelBackend
from django.db.models import Q


class UsernameOrEmailBackend(ModelBackend):

    def authenticate(self, **credentials):
        ret = None
        ret = self._authenticate_by_email(**credentials)
        if not ret:
            ret = self._authenticate_by_username(**credentials)
        return ret


    def _authenticate_by_username(self, **credentials):
        username_field = 'username'
        username = credentials.get('username')
        password = credentials.get('password')

        if not username_field or username is None or password is None:
            return None
        try:
            # Username query is case insensitive
            query = {username_field+'__iexact': username}
            user = User.objects.get(**query)
            if user.check_password(password):
                return user
        except User.DoesNotExist:
            return None

    def _authenticate_by_email(self, **credentials):
        # Even though allauth will pass along `email`, other apps may
        # not respect this setting. For example, when using
        # django-tastypie basic authentication, the login is always
        # passed as `username`.  So let's place nice with other apps
        # and use username as fallback

        email = credentials.get('email', credentials.get('username'))
        if email:
            users = User.objects.filter(Q(email__iexact=email)
                                        | Q(email_address__email__iexact=email))
            for user in users:
                if user.check_password(credentials["password"]):
                    return user
        return None