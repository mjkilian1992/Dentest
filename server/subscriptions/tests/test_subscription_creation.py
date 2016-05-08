from braintree.test.nonces import Nonces
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.customer_management import *


class SubscriptionCreationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_subscribe_valid(self):
        """
        Test case where everything is valid.
        :return:
        """
        result = self.client.post('/subscribe/',data={'payment_method_nonce':Nonces.Transactable})

        self.assertEquals(status.HTTP_201_CREATED,result.status_code)
        customer = lookup_customer(self.user)
        self.assertIsNotNone(customer.payment_method_token)
        self.assertIsNotNone(customer.subscription_id)

    def test_subscribe_already_subscribed(self):
        """
        Test case where user is already subscribed. Should fail.
        :return:
        """
        customer = lookup_customer(self.user)
        customer.subscription_id = "1"
        customer.save()

        response = self.client.post('/subscribe/',data={'payment_method_nonce':Nonces.Transactable})
        self.assertTrue('errors' in response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST,response.status_code)

    def test_subscribe_payment_missing(self):
        """
        Test case where the payment nonce is missing
        :return:
        """
        response = self.client.post('/subscribe/', data={})
        self.assertEqual(status.HTTP_402_PAYMENT_REQUIRED,response.status_code)

    def test_subscribe_invalid_payment(self):
        """
        Test case where creating the subscription fails because the user's payment is declined
        :return:
        """
        response = self.client.post('/subscribe/',data={'payment_method_nonce':Nonces.ProcessorDeclinedVisa})
        self.assertEqual(status.HTTP_400_BAD_REQUEST,response.status_code)
