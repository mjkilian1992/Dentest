import braintree
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.subscription_manager import SubscriptionManager, BraintreeError

from mockito import *

class SubscriptionCancellationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        self.braintree_user = SubscriptionManager.create_new_customer(self.user)

        self.user_not_initialized_properly = User.objects.create(username="NotInitialized", email="madeup.madeup.com")

        self.client = APIClient()



    def test_cancel_user_not_intiailized_properly(self):
        """
        Test case where we try to cancel a user whos account is not properly initialized.
        :return:
        """
        self.client.force_authenticate(user=self.user_not_initialized_properly)

        response = self.client.post('/cancel_subscription/')

        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertTrue('errors' in response.data)


    def test_cancel_request_fails(self):
        """
        Test case where the cancellation request fails.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).request_cancel(self.braintree_user).thenRaise(BraintreeError())

        response = self.client.post('/cancel_subscription/')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('errors' in response.data)

    def test_cancel_request_succeeds(self):
        """
        Test case where the cancellation request succeeds.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).request_cancel(self.braintree_user).thenReturn(True)

        response = self.client.post('/cancel_subscription/')

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)





