from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from subscriptions.customer_management import *

class ClientTokenGenerationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()


    def test_token_generation(self):
        response = self.client.get('/generate_token/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertTrue('token' in response.data)

