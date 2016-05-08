from braintree.test.nonces import Nonces

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from subscriptions.customer_management import *


class SubscriptionCreationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_subscription_status_valid_subscription(self):
        # Create subscription
        self.client.post('/subscribe/',data={'payment_method_nonce':Nonces.Transactable})

        # Now test status check
        response = self.client.get('/subscription_status/')
        self.assertEqual(status.HTTP_200_OK,response.status_code)
        self.assertTrue('price' in response.data)
        self.assertTrue('status' in response.data)
        self.assertTrue('start_date' in response.data)
        self.assertTrue('renewal_date' in response.data)

    def test_get_subscription_status_user_not_subscribed(self):
        response = self.client.get('/subscription_status/')
        self.assertEqual(status.HTTP_404_NOT_FOUND,response.status_code)
        self.assertTrue('errors' in response.data)
