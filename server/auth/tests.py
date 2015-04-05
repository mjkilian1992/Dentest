from django.test import TestCase
from django.core import mail
from django.contrib.auth.models import User,Group
from rest_framework.test import APIClient
from rest_framework import status

# Create your tests here.
class RestAuthTestCase(TestCase):

    def setUp(self):
         # Create groups with name matching Privileged Groups
        self.bronze = Group(name='Bronze')
        self.bronze.save()
        self.silver = Group(name='Silver')
        self.silver.save()

        # Create one bronze, one silver and one staff user
        self.bronze_user = User.objects.create_user('test_bronze',
                                               'bronze@fake.com',
                                               'password1',
                                               )
        self.bronze_user.groups.add(self.bronze)
        self.bronze_user.save()

        self.silver_user = User.objects.create_user('test_silver',
                                               'silver@fake.com',
                                               'password2',
                                               )
        self.silver_user.groups.add(self.silver)
        self.silver_user.save()

        self.staff_user = User.objects.create_user('test_staff',
                                              'staff@fake.com',
                                              'password3',
                                              )
        self.staff_user.is_staff = True
        self.staff_user.save()

        # Create APIFactory and Client
        self.client = APIClient()

    def tearDown(self):
        User.objects.all().delete()
        Group.objects.all().delete()
        self.client=None

    def test_login_unprivileged(self):
        '''Check a basic user can log in by both username and email methods'''
        # Test basic user login
        self.client.post('/rest-auth/login/',{'username':'test_bronze','password':'password1'},format='json')
        self.assertEqual(self.client.session.get('_auth_user_id',None),1)
        self.client.logout()

        # Test basic user login via email
        self.client.post('/rest-auth/login/',{'username':'bronze@fake.com','password':'password1'},format='json')
        self.assertEqual(self.client.session.get('_auth_user_id',None),1)
        self.client.logout()

    def test_password_reset(self):
        """Check a user can reset their password"""
        response = self.client.post('/rest-auth/password/reset/',{'email':'silver@fake.com'},format='json')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        print mail.outbox[0].subject
        print mail.outbox[0].message()

    def test_logout(self):
        '''Check logout works correctly'''
        self.client.login(username='test_silver',password='password2')
        self.assertEqual(self.client.session.get('_auth_user_id',None),2)
        self.client.post('/rest-auth/logout/',format='json')
        self.assertEqual(self.client.session.get('_auth_user_id',None),None)