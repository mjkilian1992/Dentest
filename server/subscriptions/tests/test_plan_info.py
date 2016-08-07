from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from subscriptions.subscription_manager import SubscriptionManager

from mockito import *


class PlanInfoTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).get_subscription_plan().thenReturn({
            'price' : 30,
            'billing_frequency' : 12
        })

    def test_plan_info(self):
        """
        Tests retrieving the susbcription plan from braintree.
        :return:
        """
        response = self.client.get('/plan_info/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['price'],30)
        self.assertEqual(response.data['billing_frequency'],12)




