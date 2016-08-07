from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.subscription_manager import SubscriptionManager, BraintreeError

from mockito import *


class SubscriptionCreationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        self.braintree_user = SubscriptionManager.create_new_customer(self.user)
        self.braintree_user.payment_method_token = "ValidPaymentToken"
        self.braintree_user.save()

        self.user_no_payment_method = User.objects.create(username="noPaymentMethod", email="fake@fake.com")
        self.braintree_user_no_payment = SubscriptionManager.create_new_customer(self.user_no_payment_method)

        self.user_not_properly_initialised = User.objects.create(username="NotInitialized", email="bad@fake.com")
        self.client = APIClient()

    def test_subscribe_valid(self):
        """
        Test case where everything is valid.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).subscribe(self.braintree_user).thenReturn("12345")
        result = self.client.post('/subscribe/')

        self.assertEquals(status.HTTP_201_CREATED,result.status_code)

    def test_subscribe_invalid(self):
        """
        Test case where the subscription call to underlying subscription manager fails
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).subscribe(self.braintree_user).thenRaise(BraintreeError())

        response = self.client.post('/subscribe/')
        self.assertTrue('errors' in response.data)
        self.assertEqual(status.HTTP_500_INTERNAL_SERVER_ERROR,response.status_code)

    def test_subscribe_user_has_no_payment_method(self):
        """
        Test case where user has not provided a payment method.
        :return:
        """
        self.client.force_authenticate(user=self.user_no_payment_method)

        when(SubscriptionManager).subscribe(self.braintree_user).thenRaise(BraintreeError())

        response = self.client.post('/subscribe/')
        self.assertTrue('errors' in response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST,response.status_code)

    def test_subscribe_user_not_initialised_properly(self):
        """
        Test case where the user is not initialized with an account.
        :return:
        """
        self.client.force_authenticate(user=self.user_not_properly_initialised)

        response = self.client.post('/subscribe/')
        self.assertTrue('errors' in response.data)
        self.assertEqual(status.HTTP_500_INTERNAL_SERVER_ERROR,response.status_code)
