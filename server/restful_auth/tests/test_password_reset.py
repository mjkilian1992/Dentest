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


