import braintree
from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from subscriptions.customer_management import *


class SubscriptionCancellationTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def cancellation(self):
        """
        Test case where a subscription exists and can be cancelled
        NOTE: This case will fail because it attempts to cancel a subscription which doesnt exist in Braintree database.
        :return:
        """
        # Create mock subscription
        customer = lookup_customer(self.user)
        customer.subscription_id = "1"
        customer.save()

        response = self.client.post("/cancel_subscription/")
        self.assertEqual(status.HTTP_202_ACCEPTED,response.status_code)

        # Refresh customer reference, then check they no longer have a subscription
        customer = lookup_customer(self.user)
        self.assertIsNone(customer.subscription_id)

    def cancellation_no_subscription(self):
        """
        Test case where there is no subscription to cancel
        :return:
        """
        response = self.client.post("/cancel_subscription/")
        self.assertTrue('errors' in response.data)
        self.assertEqual(status.HTTP_400_BAD_REQUEST,response.status_code)


