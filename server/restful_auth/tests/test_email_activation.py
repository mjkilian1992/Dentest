import json
from django.test import TestCase
from django.core import mail
from django.conf import settings
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import *

from dentest.settings_utility import get_setting

class RestfulAuthEmailActivationTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='pass',first_name='Joe',last_name='Bloggs')
        self.email_address = EmailAddress.objects.create(user=self.user,email=self.user.email)
        self.confirmation = self.email_address.send_confirmation()
        self.correct_details = {
            'username':'test',
            'key':self.confirmation.key,
        }
        self.client = APIClient()


    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_valid_activation(self):
        """Test a valid confirmation. Additionally check that the key cannot be reused"""
        response = self.client.post('/confirm_email/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)

        # Need to refetch
        email_address = EmailAddress.objects.get(user=self.user)
        self.assertEqual(email_address.verified,True)

        # Check key cannot be reused
        response = self.client.post('/confirm_email/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)

    def test_confirmation_malformed_key(self):
        """A confirmation request with an incorrect key should fail"""
        self.correct_details['key'] = 'lsdhfak;fhkasvh078372qwersdfjsdlf'
        response = self.client.post('/confirm_email/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('non_field_errors' in data)

         # Need to refetch
        email_address = EmailAddress.objects.get(user=self.user)
        self.assertEqual(email_address.verified,False)

    def test_confirmation_key_expired(self):
        """Check that trying to confirm and email with an expired key will fail"""
        time_valid = get_setting('EMAIL_CONFIRMATION_DAYS_VALID')
        self.confirmation.time_sent = self.confirmation.time_sent - datetime.timedelta(days=time_valid,seconds=1)
        self.confirmation.save()
        response = self.client.post('/confirm_email/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('non_field_errors' in data)

        # Need to refetch
        email_address = EmailAddress.objects.get(user=self.user)
        self.assertEqual(email_address.verified,False)