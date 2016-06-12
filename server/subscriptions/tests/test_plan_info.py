from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from subscriptions.customer_management import *


class PlanInfoTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        create_new_customer(self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_plan_info(self):
        """
        Tests retrieving the susbcription plan from braintree.
        :return:
        """
        response = self.client.get('/plan_info/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertTrue('price' in response.data)
        self.assertTrue('billing_frequency' in response.data)




