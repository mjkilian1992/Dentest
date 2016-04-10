from django.db import transaction
from django.contrib.auth.models import User
from braintree.customer import Customer
from models import BraintreeUser

class BraintreeError(Exception):
    pass

class BraintreeIDAlreadyExistsError(Exception):
    pass

def create_new_customer(user):
    """
    Create a new Braintree Customer for the user and store their Braintree ID linked to their Django user.
    Returns the braintree id for the user iof successful
    """
    with transaction.atomic():
        # Check this user does not already have a Braintree ID
        if len(BraintreeUser.objects.filter(user=user)) > 0:
            raise BraintreeIDAlreadyExistsError

        result = Customer.create({
            'first_name': user.first_name,
            'last_name':  user.last_name,
            'email': user.email,
        })
        if not result.is_success:
            raise BraintreeError

        id = result.customer.id
        customerRef = BraintreeUser(user=user,customer_id=id)
        customerRef.save()
        return id

def lookup_braintree_id(user):
    """
    Fetch the braintree ID for the provided user.
    Throws an exception if no user can be found in the Braintree lookup.
    """
    return BraintreeUser.objects.get(user=user).customer_id

