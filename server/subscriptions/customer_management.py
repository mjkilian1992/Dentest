import braintree
import settings as subscription_params
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
    Returns the braintree Customer for the user iof successful
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
        return customerRef

def lookup_customer(user):
    return BraintreeUser.objects.get(user=user)

def lookup_braintree_id(user):
    """
    Fetch the braintree ID for the provided user.
    Throws an exception if no user can be found in the Braintree lookup.
    """
    return BraintreeUser.objects.get(user=user).customer_id


def add_payment_method(user,payment_method_nonce):
    """
    Create a new payment method for the given user using Braintree payment method nonce.
    :param user: The user to create the payment method for
    :param payment_method_nonce: The payment method nonce
    """
    # Look up customer id
    try:
        customer_id = lookup_braintree_id(user)
    except BraintreeUser.DoesNotExist as e:
        return False
    # Try and create payment method
    with transaction.atomic():
        payment_token = braintree.PaymentMethod.create({
            'customer_id':customer_id,
            'payment_method_nonce':payment_method_nonce
        }).payment_method.token
        customer = lookup_customer(user)
        customer.payment_method_token = payment_token
        customer.save()
        return payment_token

def create_dentest_subscription(user,payment_method_token):
    """
    Create a new subscription for a user using their payment method token.
    :param user:
    :param payment_method_token:
    :return:
    """
    customer = lookup_customer(user)
    if customer.subscription_id is not None:
        raise BraintreeError("User already subscribed")
    with transaction.atomic():
        result = braintree.Subscription.create({
            'payment_method_token':payment_method_token,
            'plan_id':subscription_params.SUBSCRIPTION_PLAN_ID
        })
        if result is None:
            raise BraintreeError("Could not create subscription")
        customer.subscription_id = result.subscription.id
        customer.save()
        return result.subscription.id

def cancel_dentest_subscription(user):
    customer = lookup_customer(user)
    if customer.subscription_id is None:
        raise braintree.exceptions.not_found_error.NotFoundError()
    with transaction.atomic():
        braintree.Subscription.cancel(customer.subscription_id)
        customer.subscription_id = None
        customer.save()
        return True

def get_subscription(user):
    customer = lookup_customer(user)
    if customer.subscription_id is None:
        return None
    else:
        return braintree.Subscription.find(customer.subscription_id)

def change_payment_method(user,payment_method_nonce):
    with transaction.atomic():
        customer = lookup_customer(user)
        payment_token = braintree.PaymentMethod.create({
            'customer_id':customer.customer_id,
            'payment_method_nonce':payment_method_nonce
        }).payment_method.token
        try:
            braintree.Subscription.update(customer.subscription_id,{
                'payment_method_token' : payment_token,
            })
            customer.payment_method_token = payment_token
            customer.save()
        except Exception as e:
            raise BraintreeError("Could not change payment method")

def is_premium_user(user):
    customer = lookup_customer(user)
    if customer.subscription_id is None:
        return False
    response = braintree.Subscription.find(customer.subscription_id)
    return response.status == braintree.Subscription.Status.Active