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
        id = create_new_customer(self.user)
        customer = BraintreeUser.objects.get(user=self.user)
        self.assertEqual(customer.customer_id,id)

        # Now try creating another for the same user (should fail with IntegrityError)
        with self.assertRaises(BraintreeIDAlreadyExistsError):
            create_new_customer(self.user)

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