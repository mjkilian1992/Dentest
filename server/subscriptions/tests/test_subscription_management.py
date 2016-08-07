import braintree
from datetime import date, datetime
from django.test import TestCase
from django.contrib.auth.models import User
from mockito import *
from ..subscription_manager import *
from ..models import *
from ..settings import SUBSCRIPTION_PLAN_ID


class SubscriptionManagementTestCase(TestCase):


    def setUp(self):
        self.user = User.objects.create_user('test',first_name='Test',last_name='User',email='fake@madeup.com')
        self.braintree_customer = BraintreeUser.objects.create(user=self.user,customer_id="12345",payment_method_token=None)

        # Mock time info to return fixed day every time
        when(timezone).now().thenReturn(timezone.make_aware(datetime.datetime(2016,7,24,0,0,0),pytz.utc))

        # Mock successful subscription return
        subscription_success = mock()
        subscription_success.is_success = True
        sub = mock()
        sub.billing_period_end_date = timezone.datetime(2017,07,24,19,0,0) # Remove 5 hours for central time
        sub.id = "sub_id_success"
        sub.status = braintree.Subscription.Status.Active
        subscription_success.subscription = sub
        self.subscription_success = subscription_success

        self.subscription_success_params = {
            'payment_method_token': 'valid_payment_token',
            'plan_id': SUBSCRIPTION_PLAN_ID,
            'first_billing_date' : timezone.datetime(2016,07,25,0,0,0)
        }

        when(braintree.Subscription).create(self.subscription_success_params).thenReturn(self.subscription_success)

        # Payment method change mock info
        success_payment_method = mock()
        success_payment_method.token = "SuccessfulToken"
        create_payment_method_success = mock()
        create_payment_method_success.is_success = True
        create_payment_method_success.payment_method = success_payment_method

        self.create_payment_success_response = create_payment_method_success

        create_payment_method_failure = mock()
        create_payment_method_failure.is_success = False
        self.create_payment_method_failure = create_payment_method_failure

        change_payment_method_success = mock()
        change_payment_method_success.is_success = True
        self.change_payment_method_success = change_payment_method_success


        change_payment_errors = mock()
        change_payment_errors.deep_errors = "ERROR"
        change_payment_method_failure = mock()
        change_payment_method_failure.is_success = False
        change_payment_method_failure.errors = change_payment_errors

        self.change_payment_method_failure = change_payment_method_failure

        self.valid_payment_nonce = "ValidPaymentNonce"
        self.invalid_payment_nonce = "InvalidPaymentNonce"

        when(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.valid_payment_nonce,
            'options': {
                'make_default' : True
            }
        }).thenReturn(self.create_payment_success_response)

        when(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.invalid_payment_nonce,
            'options': {
                'make_default' : True
            }
        }).thenReturn(self.create_payment_method_failure)

        # Mock cancellations on Braintree
        self.cancellable_id = "ValidSubscriptionIDToCancel"
        self.non_cancelleable_id = "InvalidSubscriptionIDToCancel"

        cancel_success = mock()
        cancel_success.is_success = True
        self.cancel_success_response = cancel_success

        cancel_failure = mock()
        cancel_failure.is_success = False
        self.cancel_failure_response = cancel_failure

        when(braintree.Subscription).cancel(self.cancellable_id).thenReturn(self.cancel_success_response)
        when(braintree.Subscription).cancel(self.non_cancelleable_id).thenReturn(self.cancel_failure_response)


    def tearDown(self):
        unstub()
        self.braintree_customer.delete()
        self.user.delete()

    #================================== SUBSCRIPTION ==================================================================

    def test_subscribe_no_previous_subscription(self):
        """Test creating a subscription for a user for the first time"""
        self.braintree_customer.payment_method_token = 'valid_payment_token'
        SubscriptionManager.subscribe(self.braintree_customer)

        # fetch customer again
        self.braintree_customer = BraintreeUser.objects.get(user=self.user)
        self.assertTrue(self.braintree_customer.active)
        self.assertFalse(self.braintree_customer.pending_cancel)
        self.assertEqual(self.braintree_customer.expiry_date, timezone.make_aware(datetime.datetime(2017,7,25,0,0),pytz.utc))



    def test_subscribe_already_subscribed(self):
        """Try to subscribe when already subscribed - should fail"""
        self.braintree_customer.active = True
        self.braintree_customer.save()
        with self.assertRaises(BraintreeError):
            SubscriptionManager.subscribe(self.braintree_customer)

        # Check state not altered
        self.assertTrue(self.braintree_customer.active)
        self.assertFalse(self.braintree_customer.pending_cancel)
        self.assertIsNone(self.braintree_customer.expiry_date)

    def test_subscribe_wrong_type_provided(self):
        """Test passing in of something other than a BraintreeUser - should throw TypeError"""
        with self.assertRaises(TypeError):
            SubscriptionManager.subscribe(TypeError())

        # Check state not altered
        self.assertFalse(self.braintree_customer.active)
        self.assertFalse(self.braintree_customer.pending_cancel)
        self.assertIsNone(self.braintree_customer.expiry_date)


    def test_subscribe_missing_customer_info(self):
        """Test passing in a BraintreeUser with missing info - should fail"""
        # missing info
        with self.assertRaises(BraintreeError):
            SubscriptionManager.subscribe(self.braintree_customer)

        # Check state not altered
        self.assertFalse(self.braintree_customer.active)
        self.assertFalse(self.braintree_customer.pending_cancel)
        self.assertIsNone(self.braintree_customer.expiry_date)




    #==================================== REQUEST CANCELLATION ================================================================

    def test_request_cancel_no_subscription(self):
        """
        Test case where the user tries to cancel their subscription, but they dont have one. Should fail outright.
        :return:
        """
        # Customer has not set subscription ID
        with self.assertRaises(BraintreeError):
            SubscriptionManager.request_cancel(self.braintree_customer)

    def test_request_cancel_already_pending_cancel(self):
        """
        Test case where the user has already request a cancellation.
        :return:
        """
        self.braintree_customer.subscription_id = "1234"
        self.braintree_customer.pending_cancel = True
        self.braintree_customer.save()

        self.assertFalse(SubscriptionManager.request_cancel(self.braintree_customer))
        self.assertTrue(self.braintree_customer.pending_cancel)

    def test_request_cancel_active_subscription(self):
        """
        Test case where the user cancels their active subscription. Should mark the subscription for active cancellation
         on Braintree.
        :return:
        """
        self.braintree_customer.subscription_id = "1234"
        self.braintree_customer.pending_cancel = False
        self.braintree_customer.save()
        self.assertTrue(SubscriptionManager.request_cancel(self.braintree_customer))
        self.assertTrue(self.braintree_customer.pending_cancel)


    #=================================== CHANGE PAYMENT METHOD ========================================================

    def test_change_payment_method_no_subscription(self):
        """
        Test case where user tries to change their payment method while not subscribed. Should only change the payment
        method, but not try to change the method used for their subscription (because they dont have one).
        :return:
        """
        # Customer has no subscription, creation should just succeed
        self.assertTrue(SubscriptionManager.change_payment_method(self.braintree_customer,self.valid_payment_nonce))

        # Check new token has been set for customer
        self.assertEqual(self.create_payment_success_response.payment_method.token,
                         self.braintree_customer.payment_method_token)

        verify(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.valid_payment_nonce,
            'options': {
                'make_default' : True
            }
        })



    def test_change_payment_method_invalid_payment_no_subscription(self):
        """
        Test case where user tries to change their payment method using an invalid payment method.
        :return:
        """
        with self.assertRaises(BraintreeError):
            SubscriptionManager.change_payment_method(self.braintree_customer,self.invalid_payment_nonce)

        # Check payment token is still unset
        self.assertIsNone(self.braintree_customer.payment_method_token)

        verify(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.invalid_payment_nonce,
            'options': {
                'make_default' : True
            }
        })


    def test_change_payment_method_active_subscription_all_success(self):
        """
        Test case where user tries to change their payment method on an active subscription, and the payment method
        is valid. Creation of the new payment method and setting the new payment method for the subscription both succeed.
        :return:
        """
        self.braintree_customer.active = True
        self.braintree_customer.subscription_id = "SubscriptionID"

        # Declare server response for change on subscription
        when(braintree.Subscription).update("SubscriptionID",{
            'payment_method_token' : self.create_payment_success_response.payment_method.token
        }).thenReturn(self.change_payment_method_success)

        # Call method under test
        self.assertTrue(SubscriptionManager.change_payment_method(self.braintree_customer,self.valid_payment_nonce))

        # Check customers payment method changed
        self.assertEqual(self.create_payment_success_response.payment_method.token,
                         self.braintree_customer.payment_method_token)

        # Verifications
        verify(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.valid_payment_nonce,
            'options': {
                'make_default' : True
            }
        })

        verify(braintree.Subscription).update("SubscriptionID",{
            'payment_method_token' : self.create_payment_success_response.payment_method.token
        })





    def test_change_payment_method_active_subscription_creation_fails(self):
        """
        Test case where the user has an active subscription and tries to change their payment method, but the new
        payment method cannot be accepted. Make sure that we do not try to change their subscription to use this
        invalid payment method.
        :return:
        """
        self.braintree_customer.subscription_id = "SubscriptionID"

        # Call method under test
        with self.assertRaises(BraintreeError):
            SubscriptionManager.change_payment_method(self.braintree_customer,self.invalid_payment_nonce)

        # Check customers payment method unchanged
        self.assertIsNone(self.braintree_customer.payment_method_token)

        # Verifications
        verify(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.invalid_payment_nonce,
            'options': {
                'make_default' : True
            }
        })


    def test_change_payment_method_active_subscription_could_not_change_method(self):
        """
        Test case where the user succcessfully creates a new payment method, but cannot change their subscription to use
        it for some reason.
        :return:
        """
        self.braintree_customer.subscription_id = "SubscriptionID"
        # Declare server response for change on subscription
        when(braintree.Subscription).update("SubscriptionID",{
            'payment_method_token' : self.create_payment_success_response.payment_method.token
        }).thenReturn(self.change_payment_method_failure)

        # Call method under test
        with self.assertRaises(BraintreeError):
            SubscriptionManager.change_payment_method(self.braintree_customer,self.valid_payment_nonce)

        # Check customers payment method changed
        self.assertEqual(self.create_payment_success_response.payment_method.token,
                         self.braintree_customer.payment_method_token)

        # Verifications
        verify(braintree.PaymentMethod).create({
            'customer_id' : "12345",
            'payment_method_nonce' : self.valid_payment_nonce,
            'options': {
                'make_default' : True
            }
        })

        verify(braintree.Subscription).update("SubscriptionID",{
            'payment_method_token' : self.create_payment_success_response.payment_method.token
        })

#====================================== RENEWAL ====================================================================

    def test_renew_user_not_subscribed(self):
        """
        Test case where user tries to renew but isnt subscribed. Just defaults to the subscribe case.
        :return:
        """
        self.braintree_customer.payment_method_token = 'valid_payment_token'
        self.assertTrue(SubscriptionManager.renew(self.braintree_customer))


    def test_renew_user_pending_cancel(self):
        """
        Test case where user want to renew, but has a subscription pending cancel and
        just needs to remove this cancellation request.
        :return:
        """
        self.braintree_customer.active = True
        self.braintree_customer.pending_cancel = True
        self.braintree_customer.subscription_id = "ValidSubscriptionID"

        result = SubscriptionManager.renew(self.braintree_customer)
        self.assertEqual("ValidSubscriptionID",result)
        self.assertFalse(self.braintree_customer.pending_cancel)

    def test_renew_attempt_on_active_subscription(self):
        """
        Test case where user attempts to renew an active subscription which they have not attempted to cancel
        :return:
        """
        self.braintree_customer.pending_cancel = False
        self.braintree_customer.active = True

        with self.assertRaises(BraintreeError):
            SubscriptionManager.renew(self.braintree_customer)

#========================================= CANCELLATION ON BRAINTREE ================================================

    def test_cancel_on_braintree_success(self):
        """
        Test case where we try to cancel on braintree and succeed
        :return:
        """
        self.braintree_customer.pending_cancel = True
        self.braintree_customer.active = True
        self.braintree_customer.subscription_id = self.cancellable_id

        SubscriptionManager.cancel_on_braintree(self.braintree_customer)

        self.assertEqual("",self.braintree_customer.subscription_id)
        self.assertFalse(self.braintree_customer.pending_cancel)
        self.assertFalse(self.braintree_customer.active)


    def test_cancel_on_braintree_failure(self):
        """
        Test case where the cancellation on Braintree fails for some reason.
        :return:
        """
        self.braintree_customer.active = True
        self.braintree_customer.pending_cancel = True
        self.braintree_customer.subscription_id = self.non_cancelleable_id

        with self.assertRaises(BraintreeError):
            SubscriptionManager.cancel_on_braintree(self.braintree_customer)