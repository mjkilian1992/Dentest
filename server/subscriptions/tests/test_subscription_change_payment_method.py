from braintree.test.nonces import Nonces

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from subscriptions.customer_management import *


class SubscriptionChangePaymentMethodTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def change_payment_method_success(self):
        """Test case where the payment method can be changed successfully"""
        # First create a subscription to change
        response = self.client.post('/subscribe/',data={'payment_method_nonce':Nonces.Transactable})
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        orig_payment_token = lookup_customer(self.user).payment_method_token

        # Now try a change
        response = self.client.post('/change_payment_method/',data={'payment_method_nonce': Nonces.TransactableDiscover})
        new_token = lookup_customer(self.user).payment_method_token
        self.assertEqual(response.status_code,status.HTTP_202_ACCEPTED)
        self.assertNotEqual(orig_payment_token,new_token)
        self.assertEqual(new_token, get_subscription(self.user).payment_method_token)

    def change_payment_method_no_subscription(self):
        """Test case where the user is not subscribed"""
        response = self.client.post('/change_payment_method/',data={'payment_method_nonce': Nonces.TransactableDiscover})
        self.assertEqual(response.status_code,status.HTTP_404_NOT_FOUND)