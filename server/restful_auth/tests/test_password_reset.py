import json
from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import *


class RestfulAuthPasswordResetRequestTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='pass',first_name='Joe',last_name='Bloggs')
        self.correct_details = {
            'username':'test',
            'email':'inuse@fake.com',
            'first_name':'Joe',
            'last_name':'Bloggs',
        }
        self.client = APIClient()


    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_valid_reset_request(self):
        """Check a password reset email is sent provided all data is entered correctly"""
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox),1)

    def test_reset_request_username_missing(self):
        """Check reset fails if the username is not recognised. Should report this error."""
        self.correct_details.pop('username')
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('username' in data) # Check for error message
        self.assertEqual(len(mail.outbox),0)

    def test_reset_request_email_missing(self):
        """Check that email is required for the reset."""
        self.correct_details.pop('email')
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('email' in data) # Check for error message
        self.assertEqual(len(mail.outbox),0)

    def test_reset_first_name_missing(self):
        """Check that the users first name is required for the reset."""
        self.correct_details.pop('first_name')
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('first_name' in data) # Check for error message
        self.assertEqual(len(mail.outbox),0)

    def test_reset_last_name_missing(self):
        """Check that the users last name is required for the reset."""
        self.correct_details.pop('last_name')
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('last_name' in data) # Check for error message
        self.assertEqual(len(mail.outbox),0)

    def test_details_wrong(self):
        """
        Given incorrect user details for the username, the server should report
        that the data is wrong without explaining which field is incorrect.
        """
        self.correct_details['last_name'] = 'Bananas'
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('non_field_errors' in data) # Check for error message
        self.assertEqual(len(mail.outbox),0)

    def test_names_matched_case_insensitive(self):
        """The first and last name fields should match regardless of case"""
        self.correct_details['first_name'] = 'jOe'
        self.correct_details['last_name'] = 'bLOGGs'
        response = self.client.post('/password_reset/',self.correct_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(len(mail.outbox),1)