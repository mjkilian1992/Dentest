import braintree
from datetime import date, datetime
from django.test import TestCase
from django.contrib.auth.models import User
from mockito import *
from ..subscription_manager import *
from ..models import *
from ..managers import SubscriptionStatusManager



class SubscriptionManagementTestCase(TestCase):


    def setUp(self):
        # Mock time info to return fixed day every time
        when(timezone).now().thenReturn(timezone.make_aware(datetime.datetime(2016,7,24,0,0,0),pytz.utc))

        self.user_active = User.objects.create_user('Active',first_name='Test',last_name='User',email='fake@madeup.com')
        self.braintree_customer_active =\
            BraintreeUser.objects.create(user=self.user_active,customer_id="active_customer",payment_method_token=None,
                                         subscription_id="ActiveSubID", pending_cancel=True)

        self.user_active_pending_far_from_expiry =\
            User.objects.create_user('ActiveFarFromExpiry',first_name='Test',last_name='User',email='fake@madeup.com')
        self.braintree_customer_active_far_from_expiry =\
            BraintreeUser.objects.create(user=self.user_active_pending_far_from_expiry,
                                         customer_id="active_far_from_expiry_customer",payment_method_token=None,
                                         subscription_id="ActiveFarSubID", pending_cancel=True)

        self.user_active_not_pending_cancel =\
            User.objects.create_user('ActiveNotPendingCancel',first_name='Test',last_name='User',email='fake@madeup.com')
        self.braintree_customer_active_not_pending_cancel =\
            BraintreeUser.objects.create(user=self.user_active_not_pending_cancel,
                                         customer_id="active_customer",payment_method_token=None,
                                         subscription_id="ActiveNotCancelPendingSubID", pending_cancel=True)

        self.user_pending = User.objects.create_user('Pending',first_name='Test',last_name='User',email='pending@madeup.com')
        self.braintree_customer_pending =\
            BraintreeUser.objects.create(user=self.user_pending,customer_id="pending_customer",payment_method_token=None, subscription_id = "PendingSubID")

        self.user_past_due = User.objects.create_user('PastDue',first_name='Test',last_name='User',email='pastdue@madeup.com')
        self.braintree_customer_past_due = \
            BraintreeUser.objects.create(user=self.user_past_due,customer_id="past_due_customer",payment_method_token=None, subscription_id = "PastDueSubID")

        self.user_cancelled = User.objects.create_user('Cancelled',first_name='Test',last_name='User',email='cancelled@madeup.com')
        self.braintree_customer_cancelled = \
            BraintreeUser.objects.create(user=self.user_cancelled,customer_id="cancelled_customer",payment_method_token=None, subscription_id = "CancelledSubID")

        self.user_expired = User.objects.create_user('Expired',first_name='Test',last_name='User',email='expired@madeup.com')
        self.braintree_customer_expired = \
            BraintreeUser.objects.create(user=self.user_expired,customer_id="expired_customer",payment_method_token=None, subscription_id = "ExpiredID")

        self.subscription_active = mock()
        self.subscription_active.status = braintree.Subscription.Status.Active
        self.subscription_active.billing_period_end_date = timezone.make_aware(datetime.datetime(2016,07,24,0,2,0),pytz.utc)

        self.subscription_pending = mock()
        self.subscription_pending.status = braintree.Subscription.Status.Pending
        self.subscription_pending.billing_period_end_date = timezone.make_aware(datetime.datetime(2016,11,02,0,2,0),pytz.utc)

        self.subscription_past_due = mock()
        self.subscription_past_due.status = braintree.Subscription.Status.PastDue
        self.subscription_past_due.billing_period_end_date = timezone.make_aware(datetime.datetime(2016,10,03,0,2,0),pytz.utc)

        self.subscription_cancelled = mock()
        self.subscription_cancelled.status = braintree.Subscription.Status.Canceled

        self.subscription_expired = mock()
        self.subscription_expired.status = braintree.Subscription.Status.Expired

        when(braintree.Subscription).find("ActiveSubID").thenReturn(self.subscription_active)
        when(braintree.Subscription).find("PendingSubID").thenReturn(self.subscription_pending)
        when(braintree.Subscription).find("PastDueSubID").thenReturn(self.subscription_past_due)
        when(braintree.Subscription).find("CancelledSubID").thenReturn(self.subscription_cancelled)
        when(braintree.Subscription).find("ExpiredID").thenReturn(self.subscription_expired)


    def tearDown(self):
        unstub()
        User.objects.all().delete()
        BraintreeUser.objects.all().delete()


    def test_match_braintree_state(self):
        """
        Test matching the state of all subscriptions with Braintree
        :return:
        """
        SubscriptionStatusManager.match_braintree_state()

        # Refresh references
        self.braintree_customer_active = BraintreeUser.objects.get(user=self.user_active)
        self.braintree_customer_pending = BraintreeUser.objects.get(user=self.user_pending)
        self.braintree_customer_past_due = BraintreeUser.objects.get(user=self.user_past_due)
        self.braintree_customer_cancelled = BraintreeUser.objects.get(user=self.user_cancelled)
        self.braintree_customer_expired = BraintreeUser.objects.get(user=self.user_expired)

        # Check active subscription  - pending cancel state should not have been changed
        self.assertTrue(self.braintree_customer_active.active)
        self.assertTrue(self.braintree_customer_active.pending_cancel)
        self.assertEqual(timezone.make_aware(datetime.datetime(2016,7,24,0,2,0),pytz.utc), self.braintree_customer_active.expiry_date)

        # Check pending subscription - again no change to pending cancel
        self.assertTrue(self.braintree_customer_pending.active)
        self.assertFalse(self.braintree_customer_pending.pending_cancel)
        self.assertEqual(timezone.make_aware(datetime.datetime(2016,11,02,0,2,0),pytz.utc), self.braintree_customer_pending.expiry_date)

        # Check past due subscription
        self.assertFalse(self.braintree_customer_past_due.active)
        self.assertFalse(self.braintree_customer_past_due.pending_cancel)
        self.assertEqual(timezone.make_aware(datetime.datetime(2016,10,03,0,2,0),pytz.utc), self.braintree_customer_past_due.expiry_date)

        # Check cancelled subscription
        self.assertFalse(self.braintree_customer_cancelled.active)
        self.assertFalse(self.braintree_customer_cancelled.pending_cancel)
        self.assertIsNone(self.braintree_customer_cancelled.expiry_date)
        self.assertEqual("", self.braintree_customer_cancelled.subscription_id)

        # Check expired subscription
        self.assertFalse(self.braintree_customer_expired.active)
        self.assertFalse(self.braintree_customer_expired.pending_cancel)
        self.assertIsNone(self.braintree_customer_expired.expiry_date)
        self.assertEqual("", self.braintree_customer_expired.subscription_id)

    def test_cancel_pending_subscriptions(self):
        """
        Test that subscriptions which are pending cancel and withing the time threshold are called for cancellation on Braintree
        :return:
        """
        # Want active subscription 1 to be cancelled
        cancel_response = mock()
        cancel_response.is_success = True
        when(braintree.Subscription).cancel(self.braintree_customer_active.subscription_id).thenReturn(cancel_response)

        # Set timestamps
        # within two days
        self.braintree_customer_active.expiry_date = timezone.make_aware(datetime.datetime(2016,7,25,0,0),pytz.utc)
        self.braintree_customer_active.active = True
        self.braintree_customer_active.save()

        # far from two days, but still pending cancel
        self.braintree_customer_active_far_from_expiry.active = True
        self.braintree_customer_active_far_from_expiry.expiry_date = timezone.make_aware(datetime.datetime(2016,9,22,0,0),pytz.utc)
        self.braintree_customer_active_far_from_expiry.pending_cancel = True
        self.braintree_customer_active_far_from_expiry.save()

        # Close to expiry, but not pending cancellation
        self.braintree_customer_active_not_pending_cancel.active = True
        self.braintree_customer_active_not_pending_cancel.expiry_date = timezone.make_aware(datetime.datetime(2016,7,22,0,0),pytz.utc)
        self.braintree_customer_active_not_pending_cancel.pending_cancel = False
        self.braintree_customer_active_not_pending_cancel.save()

        # Call method under test
        SubscriptionStatusManager.cancel_all_pending_cancel(days_left=2)

        # Check statuses (only first customer should have been cancelled)
        # Refresh references
        self.braintree_customer_active = BraintreeUser.objects.get(user=self.user_active)
        self.braintree_customer_active_far_from_expiry = BraintreeUser.objects.get(user=self.user_active_pending_far_from_expiry)
        self.braintree_customer_active_not_pending_cancel = BraintreeUser.objects.get(user=self.user_active_not_pending_cancel)

        # Check user who should have been cancelled
        self.assertFalse(self.braintree_customer_active.active)
        self.assertFalse(self.braintree_customer_active.pending_cancel)
        self.assertEqual("",self.braintree_customer_active.subscription_id)
        self.assertIsNone(self.braintree_customer_active.expiry_date)
        verify(braintree.Subscription).cancel("ActiveSubID")

        # Check user who was far from expiry
        self.assertTrue(self.braintree_customer_active_far_from_expiry.active)
        self.assertTrue(self.braintree_customer_active_far_from_expiry.pending_cancel)
        self.assertIsNotNone(self.braintree_customer_active_far_from_expiry.expiry_date)
        self.assertEqual("ActiveFarSubID",self.braintree_customer_active_far_from_expiry.subscription_id)

        # Check user who was not pending cancel but within the expiry date (i.e. will renew automatically soon)
        self.assertTrue(self.braintree_customer_active_not_pending_cancel.active)
        self.assertFalse(self.braintree_customer_active_not_pending_cancel.pending_cancel)
        self.assertIsNotNone(self.braintree_customer_active_not_pending_cancel.expiry_date)
        self.assertEqual("ActiveNotCancelPendingSubID",self.braintree_customer_active_not_pending_cancel.subscription_id)

