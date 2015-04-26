__author__ = 'mkilian'
import json
from django.test import TestCase
from django.core import mail
from django.contrib.auth import authenticate
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token
from ..models import *


class RestfulAuthTokenLoginTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='pass')
        self.client = APIClient()

        self.credentials_username = {
            'username':'test',
            'password':'pass',
        }
        self.credentials_email = {
            'username':'inuse@fake.com',
            'password':'pass',
        }

    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_authentication(self):
        """Check the custom auth backends allows authentication by both username and email"""
        user = authenticate(username='test',password='pass')
        self.assertTrue(user is not None)
        user = authenticate(username='inuse@fake.com',password='pass')
        self.assertTrue(user is not None)

    def test_login_by_username_verified(self):
        """
        Tests a user can log in using their username once their account
        has been verified and they provide the right credentials
        """
        EmailAddress.objects.create(user=self.user,email='inuse@fake.com',verified=True)
        response = self.client.post('/login/',self.credentials_username,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(data['username'],'test')
        self.assertTrue('token' in data)

    def test_login_by_email_verified(self):
        """
        Tests a user can log in using their email once their account
        has been verified and they provide the right credentials
        """
        EmailAddress.objects.create(user=self.user,email='inuse@fake.com',verified=True)
        response = self.client.post('/login/',self.credentials_email,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(data['username'],'test')
        self.assertTrue('token' in data)

    def test_login_incorrect_credentials(self):
        """
        If the credentials provided dont match any known user an error should be returned.
        """
        incorrect = {'username':'wrong','password':'gibberish'}
        response = self.client.post('/login/',incorrect,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertEqual('non_field_errors' in data)


    def test_login_not_verified(self):
        """
        Trying to log in without email being verified should result in an error and a confirmation email resend.
        """
        EmailAddress.objects.create(user=self.user,email='inuse@fake.com',verified=False)
        response = self.client.post('/login/',self.credentials_email,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)
        self.assertTrue('non_field_errors' in data)
        self.assertEqual(len(mail.outbox),1)