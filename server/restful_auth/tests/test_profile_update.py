import json
from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status
from ..models import *


class RestfulAuthProfileUpdateTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='pass',first_name='Joe',last_name='Bloggs')
        EmailAddress.objects.create(user=self.user,email='inuse@fake.com',verified='True')
        self.original_details = {
            'email':'inuse@fake.com',
            'first_name':'Joe',
            'last_name':'Bloggs',
        }
        self.client = APIClient()


    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_update_unauthenticated(self):
        """An unauthenticated user should not be able to perform any kind of update"""
        response = self.client.put('/update_profile/',self.original_details,format='json')
        self.assertEqual(response.status_code,status.HTTP_401_UNAUTHORIZED)

    def test_disallow_username_update(self):
        """A user should not be able to change their username (this uniquely identifies them"""
        data = {
            'username' : 'newUsername',
            'email': 'newemail@fake.com',
            'first_name': 'Steve',
            'last_name': 'P',
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(User.objects.all()),1) #No new user should be created

    def test_email_update(self):
        """A user can update their email to a new valid email. This email must be reconfirmed"""
        # Check a valid email is accepted
        # The corresponding EmailAddress should be updated and a confirmation email sent out
        self.original_details['email'] = 'test@fake.com'
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',self.original_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(data['email'],'test@fake.com')
        self.assertEqual(len(User.objects.all()),1) # Should not create a new user
        self.assertEqual(EmailAddress.objects.get(user=self.user).email,'test@fake.com')
        self.assertEqual(len(mail.outbox),1)

        # Check an invalid email is rejected
        self.original_details['email'] = 'notavalidemail'
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',self.original_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('email' in data)

        # Check an email which is in use by another user is rejected
        seconduser = User.objects.create_user(username='test2',email='alreadytaken@fake.com')
        EmailAddress.objects.create(user=seconduser,email=seconduser.email,verified=False)
        self.assertEqual(len(User.objects.all()),2) # Check new user was created
        # Check an invalid email is rejected
        self.original_details['email'] = 'alreadytaken@fake.com'
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',self.original_details,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('email' in data)

    def test_name_update(self):
        """Test that the users name can be updated. There are no uniqueness constraints on names"""
        self.original_details['first_name'] = 'Charles'
        self.original_details['last_name'] = 'Darwin'
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',self.original_details,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(mail.outbox),0) # No email should be sent

    def test_update_all(self):
        """Make sure that a complete update maintains the same user"""
        pk_before_change = self.user.pk
        data = {
            'email': 'newemail@fake.com',
            'first_name': 'Steve',
            'last_name': 'P',
        }
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/update_profile/',data,format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(User.objects.all()),1) #No new user should be created
        self.assertEqual(len(mail.outbox),1) #New email needs to be verified
        user_update = User.objects.get(username='test')
        self.assertEqual(pk_before_change,user_update.pk)
