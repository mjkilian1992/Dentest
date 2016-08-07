import braintree
import datetime

from django.test import TestCase
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.test import APIClient

from mockito import *

from subscriptions.subscription_manager import SubscriptionManager
from subscriptions.models import BraintreeUser


class SubscriptionStatusTestCase(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.user = User.objects.create(first_name = 'test', last_name = 'User', username='test123', email='fake@madeup.com')
        self.braintree_user = SubscriptionManager.create_new_customer(self.user)
        self.braintree_user.subscription_id = "ValidSubscriptionID"
        self.braintree_user.save()


        self.user_pending_cancel = User.objects.create(username = 'TestUserPendingCancel', email='pending@fake.com')
        self.braintree_user_pending_cancel = SubscriptionManager.create_new_customer(self.user_pending_cancel)
        self.braintree_user_pending_cancel.subscription_id = "ValidSubscriptionID"
        self.braintree_user_pending_cancel.pending_cancel = True
        self.braintree_user_pending_cancel.save()


        self.user_not_subscribed = User.objects.create(username = "TestUserNotSubscribed", email="notsubbed@madeup.fake")
        self.braintree_user_not_subscribed = SubscriptionManager.create_new_customer(self.user_not_subscribed)

        self.user_not_subscribed_return = mock()
        
        self.user_subscribed_active_return = mock()
        self.user_subscribed_active_return.status = braintree.Subscription.Status.Active
        self.user_subscribed_active_return.billing_period_start_date = datetime.datetime(2016,8,7)
        self.user_subscribed_active_return.billing_period_end_date = datetime.datetime(2017,8,7)
        self.user_subscribed_active_return.created_at = datetime.datetime(2017,8,7)
        self.user_subscribed_active_return.price = 30
        
        self.user_subscribed_pending_return = mock()
        self.user_subscribed_pending_return.status = braintree.Subscription.Status.Pending
        self.user_subscribed_pending_return.billing_period_start_date = datetime.datetime(2016,8,7)
        self.user_subscribed_pending_return.billing_period_end_date = datetime.datetime(2017,8,7)
        self.user_subscribed_pending_return.created_at = datetime.datetime(2017,8,7)
        self.user_subscribed_pending_return.price = 30
        
        self.user_subscribed_past_due_return = mock()
        self.user_subscribed_past_due_return.status = braintree.Subscription.Status.PastDue
        self.user_subscribed_past_due_return.billing_period_start_date = datetime.datetime(2016,8,7)
        self.user_subscribed_past_due_return.billing_period_end_date = datetime.datetime(2017,8,7)
        self.user_subscribed_past_due_return.created_at = datetime.datetime(2017,8,7)
        self.user_subscribed_past_due_return.price = 30
        
        self.user_subscribed_cancelled_return = mock()
        self.user_subscribed_cancelled_return.status = braintree.Subscription.Status.Canceled
        self.user_subscribed_cancelled_return.billing_period_start_date = datetime.datetime(2016,8,7)
        self.user_subscribed_cancelled_return.billing_period_end_date = datetime.datetime(2017,8,7)
        self.user_subscribed_cancelled_return.created_at = datetime.datetime(2017,8,7)
        self.user_subscribed_cancelled_return.price = 30
        
        self.user_subscribed_expired_return = mock()
        self.user_subscribed_expired_return.status = braintree.Subscription.Status.Expired
        self.user_subscribed_expired_return.billing_period_start_date = datetime.datetime(2016,8,7)
        self.user_subscribed_expired_return.billing_period_end_date = datetime.datetime(2017,8,7)
        self.user_subscribed_expired_return.created_at = datetime.datetime(2017,8,7)
        self.user_subscribed_expired_return.price = 30
        

    def test_status_user_not_subscribed(self):
        """
        Test case where we try to fetch the subscription status for a user who is not subscribed
        :return:
        """
        # Log in as unsubscribed user
        self.client.force_authenticate(user=self.user_not_subscribed)

        response = self.client.get('/subscription_status/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data,{})
        
        
    def test_status_user_active(self):
        """
        Test case where the user is subscribed and that subscription is active.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user)\
            .thenReturn(self.user_subscribed_active_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],'Active')
        self.assertEqual(sub_info['first_billing_date'],self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'],self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'],self.user_subscribed_active_return.price)
        
    def test_status_user_pending(self):
        """
        Test case where the user is subscribed and that subscription is pending.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user)\
            .thenReturn(self.user_subscribed_pending_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],'Pending')
        self.assertEqual(sub_info['first_billing_date'],self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'], self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'],self.user_subscribed_active_return.price)
        
    def test_status_user_past_due(self):
        """
        Test case where the user subscribed and that subscription is past due
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user)\
            .thenReturn(self.user_subscribed_past_due_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],'Problem collecting payment')
        self.assertEqual(sub_info['first_billing_date'], self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'], self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'], self.user_subscribed_active_return.price)
    
    def test_status_user_cancelled_on_braintree(self):
        """
        Test case where the user is subscribed but their subscription is now cancelled on braintree.
        This shouldnt ever be used, as once their subscription is cancelled we should remove subscription data.
        However, should this occur due to an error, we still want to handle this case gracefully.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user)\
            .thenReturn(self.user_subscribed_cancelled_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],'Cancelled')
        self.assertEqual(sub_info['first_billing_date'], self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'], self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'], self.user_subscribed_active_return.price)
        
    def test_status_user_subscription_expired(self):
        """
        Test case where the user is subscribed and their subscription has now expired.
        Again, like cancelled on braintree, we dont really expect this to ever happen.
        However, we still want to handle it gracefully here.
        :return:
        """
        self.client.force_authenticate(user=self.user)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user)\
            .thenReturn(self.user_subscribed_expired_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],'Expired')
        self.assertEqual(sub_info['first_billing_date'], self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'], self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'], self.user_subscribed_active_return.price)
        
    def test_status_user_subscription_pending_cancellation(self):
        """
        Test case where the user is subscribed, but has put in a request to cancel that subscription.
        :return:
        """
        self.client.force_authenticate(user=self.user_pending_cancel)

        when(SubscriptionManager).fetch_subscription_from_braintree(self.braintree_user_pending_cancel)\
            .thenReturn(self.user_subscribed_active_return)

        response = self.client.get('/subscription_status/')

        sub_info = response.data
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(sub_info['status'],"Pending Cancellation")
        self.assertEqual(sub_info['first_billing_date'], self.user_subscribed_active_return.billing_period_start_date)
        self.assertEqual(sub_info['renewal_or_cancel_date'], self.user_subscribed_active_return.billing_period_end_date)
        self.assertEqual(sub_info['date_of_creation'], self.user_subscribed_active_return.created_at)
        self.assertEqual(sub_info['price'], self.user_subscribed_active_return.price)