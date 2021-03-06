import json

from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import Group
from rest_framework.test import APIClient
from rest_framework import status

from ..models import *
from subscriptions.models import BraintreeUser


class RestfulAuthRegistrationTestCase(TestCase):

    def setUp(self):
        self.bronze = Group(name='Free')
        self.bronze.save()
        self.silver = Group(name='Premium')
        self.silver.save()
        self.user = User.objects.create_user('test',email='inuse@fake.com',password='GBG18H42,]bb')
        EmailAddress.objects.create(user=self.user,email='inuse@fake.com',verified=True)
        self.client = APIClient()

    def tearDown(self):
        Group.objects.all().delete()
        User.objects.all().delete()
        self.client = None

    def test_token_creation(self):
        """Check that an auth Token is created when the user is created"""
        self.assertTrue(Token.objects.get(user=self.user != None))

    def test_reg_all_details_valid(self):
        """Simply test that a user can register with valid details"""
        test_data = {
            'username':'test1',
            'email':'test@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)

        user = User.objects.get(username__iexact='test1')
        self.assertEqual(user.email,'test@fake.com')
        self.assertEqual(user.get_full_name(),'michael kilian')

        # Check email saved and confirmation email sent
        email_address = EmailAddress.objects.get(user=user)
        self.assertEqual(email_address.email,'test@fake.com')
        self.assertEqual(email_address.verified,False)
        confirmation = EmailConfirmation.objects.get(email_address=email_address)
        self.assertEqual(len(mail.outbox),1)

        # Check Braintree account was created
        try:
            customer = BraintreeUser.objects.get(user=user)
        except Exception as e:
            self.fail("Braintree ID not created")


    def test_reg_username_taken(self):
        """Test that a user cannot be created with a username which is already in use"""
        test_data = {
            'username':'test',
            'email':'test@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('username' in data)  # Check for error message

    def test_username_missing(self):
        """A request with a blank username should fail, pointing out that username is required"""
        test_data = {
            'username':'',
            'email':'test@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('username' in data)  # Check for error message

    def test_reg_email_taken(self):
        """Test that a user cannot be created with an email address which is already in use"""
        test_data = {
            'username':'test1',
            'email':'inuse@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data= json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('email' in data)  # Check for error message

    def test_email_missing(self):
        """A request with a blank email should fail, pointing out that email is required"""
        test_data = {
            'username':'test1',
            'email':'',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('email' in data)  # Check for error message

    def test_reg_passwords_invalid(self):
        """
        The users password must be sufficiently complex. Note that only the first password is checked,
        as the second password must match the first anyway.
        """
        test_data = {
            'username':'test1',
            'email':'',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'password',
            'password2':'password',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('password1' in data)  # Check for error message


    def test_reg_passwords_dont_match(self):
        """If the two passwords entered dont match, an error should be thrown."""
        test_data = {
            'username':'test1',
            'email':'test@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'12345t6asdfghASD##',
        }
        response = self.client.post('/register/',test_data,format='json')
        data= json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('non_field_errors' in data)

    def test_password_missing(self):
        """
        A request with a blank password1 or password2 should fail,
        pointing out that both password1 and password2 is required
        """
        test_data = {
            'username':'test1',
            'email':'fake@fake.com',
            'first_name':'michael',
            'last_name':'kilian',
            'password1':'',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('password1' in data)  # Check for error message

        test_data['password1'] = 'GBG18H42,]bb'
        test_data['password2'] = ''
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('password2' in data)  # Check for error message

    def test_first_name_missing(self):
        """
        A request with a blank first_name should fail, pointing out that first_name is required
        """
        test_data = {
            'username':'test1',
            'email':'fake@fake.com',
            'first_name':'',
            'last_name':'kilian',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('first_name' in data)  # Check for error message

    def test_last_name_missing(self):
        """
        A request with a blank last_name should fail, pointing out that last_name is required
        """
        test_data = {
            'username':'test1',
            'email':'fake@fake.com',
            'first_name':'michael',
            'last_name':'',
            'password1':'GBG18H42,]bb',
            'password2':'GBG18H42,]bb',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        self.assertTrue('last_name' in data)  # Check for error message

    def test_all_data_missing(self):
        """If no data is provided, all fields should return an empty error"""
        test_data={
            'username':'',
            'email':'',
            'first_name':'',
            'last_name':'',
            'password1':'',
            'password2':'',
        }
        response = self.client.post('/register/',test_data,format='json')
        data = json.loads(response.content)
        self.assertEqual(response.status_code,status.HTTP_400_BAD_REQUEST)
        for i in test_data:
            self.assertTrue(i in data)