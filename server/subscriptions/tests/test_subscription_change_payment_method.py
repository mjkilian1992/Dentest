from django.test import TestCase
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APIClient

from subscriptions.subscription_manager import SubscriptionManager, BraintreeError

from mockito import *

class SubscriptionChangePaymentMethodTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        self.braintree_user = SubscriptionManager.create_new_customer(self.user)

        self.user_not_initialized = User.objects.create(username = "UserNotInitialized", email="fake@notInit.com")

        self.valid_payment_nonce = "ValidPaymentNonce"
        self.invalid_payment_nonce = "InvalidPaymentNonce"

        self.client = APIClient()

        when(SubscriptionManager).change_payment_method(self.braintree_user,self.valid_payment_nonce).thenReturn(True)
        when(SubscriptionManager).change_payment_method(self.braintree_user,self.invalid_payment_nonce).thenRaise(BraintreeError())


    def test_change_payment_method_no_nonce_provided(self):
        """
        Test case where no payment nonce is provided for the change.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/change_payment_method/',{})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('errors' in response.data)



    def test_change_payment_user_not_initialized_properly(self):
        """
        Test case where the user is not properly initialized with an account
        :return:
        """
        self.client.force_authenticate(user=self.user_not_initialized)

        response = self.client.post('/change_payment_method/',{})
        self.assertEqual(response.status_code,status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertTrue('errors' in response.data)

    def test_change_payment_change_fails(self):
        """
        Test case where the change fails on subscription management
        :return:
        """
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/change_payment_method/',{'payment_method_nonce':self.invalid_payment_nonce})
        self.assertEqual(response.status_code,status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_change_payment_change_succeeds(self):
        """
        Test case where the change succeeds on subscription management
        :return:
        """
        self.client.force_authenticate(user=self.user)

        response = self.client.post('/change_payment_method/',{'payment_method_nonce':self.valid_payment_nonce})
        self.assertEqual(response.status_code,status.HTTP_202_ACCEPTED)