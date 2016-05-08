import braintree
from braintree.exceptions import not_found_error
from braintree.test.nonces import Nonces
from django.test import TestCase
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User
from ..customer_management import *


class CustomerManagementTestCase(TestCase):

    def setUp(self):
        self.user = User.objects.create_user('test',first_name='Test',last_name='User',email='fake@madeup.com')

    def test_braintree_id_creation(self):
        """
        Test the creation of a new Braintree customer for a user.
        There can only be one Braintree Customer per user.
        """
        # Create a user id and see that it is in the database
        created = create_new_customer(self.user)
        customer = BraintreeUser.objects.get(user=self.user)
        self.assertEqual(customer.customer_id,created.customer_id)

        # Now try creating another for the same user (should fail with IntegrityError)
        with self.assertRaises(BraintreeIDAlreadyExistsError):
            create_new_customer(self.user)

    def test_customer_lookup(self):
        """
        Test basic lookup of Braintree customer matching the user
        """
        customer = BraintreeUser(user=self.user,customer_id=u'1')
        customer.save()
        self.assertEqual(customer,lookup_customer(self.user))

    def test_customer_lookup_no_customer(self):
        """
        Test case where a corresponding Braintree customer doesnt exist for the user
        """
        with self.assertRaises(ObjectDoesNotExist):
            lookup_customer(self.user)

    def test_braintree_id_lookup_id_present(self):
        """
        Test the lookup of the Braintree ID for a user.
        """
        id_lookup_entry = BraintreeUser(user=self.user,customer_id=u'1')
        id_lookup_entry.save()

        self.assertEqual(u'1',lookup_braintree_id(self.user))

    def test_braintree_id_lookup_id_missing(self):
        """
        Test the lookup of Braintree ID for a user where no id exists.
        """
        with self.assertRaises(ObjectDoesNotExist):
            lookup_braintree_id(self.user)

    def test_create_payment_method(self):
        """
        Test creation of a payment method from a valid payment token.
        :return:
        """
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(self.user,Nonces.Transactable)
        # Refresh customer id
        customer = lookup_customer(self.user)
        self.assertEqual(customer.payment_method_token, payment_token)

    def test_create_payment_method_nonce_already_consumed(self):
        """
        Test case where the payment nonce has already been consumed
        :return:
        """
        customer = create_new_customer(self.user)
        with self.assertRaises(AttributeError):
            payment_token = add_payment_method(self.user,Nonces.Consumed)

    def test_create_subscription(self):
        """
        Test basic creation of a subscription.
        :return:
        """
        # Create a valid customer and payment method
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)
        # Try and create the subscription
        sub_id = create_dentest_subscription(self.user,payment_token)
        # Refresh customer reference
        customer = lookup_customer(self.user)
        self.assertEquals(sub_id, customer.subscription_id)

    def test_create_subscription_user_already_subscribed(self):
        """
        Test case where user is already subscribed
        :return:
        """
        # Create a valid customer and payment method
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)
        # Try and create the subscription
        sub_id = create_dentest_subscription(self.user,payment_token)

        # Now try and subscribe again - should fail
        with self.assertRaises(BraintreeError):
            create_dentest_subscription(self.user,payment_token)


    def test_cancel_subscription(self):
        """
        Test cancelling a subscription for a user.
        :return:
        """
        # Create a valid customer and payment method
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)
        # Try and create the subscription
        sub_id = create_dentest_subscription(self.user,payment_token)

        # Now try to cancel the subscription - this should succeed
        self.assertTrue(cancel_dentest_subscription(self.user))

    def test_cancel_subscription_no_subscription_active(self):
        # Create a valid customer and payment method
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)

        with self.assertRaises(not_found_error.NotFoundError):
            cancel_dentest_subscription(self.user)

    def test_is_premium_user_user_subscribed(self):
        """Create a subscription for a user and make sure they are treated as a premium user"""
        # Create a valid customer and payment method
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)
        # Try and create the subscription
        sub_id = create_dentest_subscription(self.user,payment_token)

        # Now check to see if this user is subscribed
        self.assertTrue(is_premium_user(self.user))

    def test_is_premium_user_user_not_subscribed(self):
        """Check that a user without a subscription is not treated as a premium user"""
        customer = create_new_customer(self.user)
        payment_token = add_payment_method(customer,Nonces.Transactable)
        # No subscription created yet - should not be premium
        self.assertFalse(is_premium_user(self.user))