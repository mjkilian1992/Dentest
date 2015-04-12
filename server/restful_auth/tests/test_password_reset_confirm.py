import json
from django.test import TestCase
from django.core import mail
from django.conf import settings
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import *


class RestfulAuthPasswordResetConfirmTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='pass',first_name='Joe',last_name='Bloggs')
        self.password_reset = PasswordReset.create(self.user)
        self.password_reset.send()
        self.correct_details = {
            'username':'test',
            'key':self.password_reset.key,
            'password1':'newpass',
            'password2':'newpass',
        }
        self.client = APIClient()


    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_valid_reset(self):
        """Test a valid password reset"""
        response = self.client.post('/password_reset_confirm/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
         # Need to refetch user (queryset caching)
        user = User.objects.get(username='test')
        self.assertTrue(user.check_password('newpass')) # Check new password works

    def test_reset_malformed_key(self):
        """A reset request with an incorrect key should fail"""
        self.correct_details['key'] = 'lsdhfak;fhkasvh078372qwersdfjsdlf'
        response = self.client.post('/password_reset_confirm/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('non_field_errors' in data)

        # Need to refetch user (queryset caching)
        user = User.objects.get(username='test')
        self.assertTrue(user.check_password('pass')) # Make sure old password is still right

    def test_reset_key_expired(self):
        """Check that trying to reset the password with an expired key will fail"""
        time_valid = getattr(settings,'PASSWORD_RESET_DAYS_VALID')
        self.password_reset.time_sent = self.password_reset.time_sent - datetime.timedelta(days=time_valid,seconds=1)
        self.password_reset.save()
        response = self.client.post('/password_reset_confirm/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('non_field_errors' in data)