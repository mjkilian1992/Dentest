import braintree
import settings
import pytz, datetime

from django.db import transaction
from django.contrib.auth.models import User
from django.utils import timezone
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
            'last_name': user.last_name,
            'email': user.email,
        })
        if not result.is_success:
            raise BraintreeError

        id = result.customer.id
        customerRef = BraintreeUser(user=user, customer_id=id)
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


def add_payment_method(user, payment_method_nonce):
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
        result = braintree.PaymentMethod.create({
            'customer_id': customer_id,
            'payment_method_nonce': payment_method_nonce
        })
        if isinstance(result, braintree.ErrorResult):
            return False
        payment_token = result.payment_method.token
        custmr = lookup_customer(user)
        custmr.payment_method_token = payment_token
        custmr.save()
        return payment_token


def create_dentest_subscription(user, payment_method_token):
    """
    Create a new subscription for a user using their payment method token.
    :param user:
    :param payment_method_token:
    :return:
    """
    custmr = lookup_customer(user)
    valid_cancelled_subscription = False
    if custmr.active and custmr.subscription_id != "":
        raise BraintreeError("User already subscribed with active subscription")
    elif (not custmr.active) and custmr.subscription_id != "" and custmr.expiry_date > timezone.now():
        valid_cancelled_subscription = True
    with transaction.atomic():
        try:
            if valid_cancelled_subscription:
                result = braintree.Subscription.create({
                    'payment_method_token': payment_method_token,
                    'plan_id': settings.SUBSCRIPTION_PLAN_ID,
                    'first_billing_date': custmr.expiry_date
                })
            else:
                result = braintree.Subscription.create({
                    'payment_method_token': payment_method_token,
                    'plan_id': settings.SUBSCRIPTION_PLAN_ID,
                })
        except Exception as e:
            print e
            result = None

        if result is None:
            raise BraintreeError("Could not create subscription")
        custmr.subscription_id = result.subscription.id
        custmr.active = True
        custmr.save()
        return result.subscription.id


def cancel_dentest_subscription(user):
    custmr = lookup_customer(user)
    if custmr.subscription_id == "":
        raise braintree.exceptions.not_found_error.NotFoundError()
    with transaction.atomic():
        cancel_result = braintree.Subscription.cancel(custmr.subscription_id).subscription
        # If the customers subscription has expired, we can use a new ezpiry date (previous subscription is no longer valid)
        if custmr.expiry_date is None or custmr.expiry_date < timezone.now():
            custmr.expiry_date = cancel_result.billing_period_end_date
            custmr.active = False
            custmr.save()
    return True


def get_subscription(user):
    custmr = lookup_customer(user)
    if custmr.subscription_id == "":
        return None
    else:
        return braintree.Subscription.find(custmr.subscription_id)


def change_payment_method(user, payment_method_nonce):
    with transaction.atomic():
        custmr = lookup_customer(user)
        payment_token = braintree.PaymentMethod.create({
            'customer_id': custmr.customer_id,
            'payment_method_nonce': payment_method_nonce,
            "options": {
                "make_default": True
            }
        }).payment_method.token
        try:
            braintree.Subscription.update(custmr.subscription_id, {
                'payment_method_token': payment_token,
            })
            custmr.payment_method_token = payment_token
            custmr.save()
        except Exception as e:
            raise BraintreeError("Could not change payment method")


def get_subscription_plan():
    try:
        plan = braintree.Plan.all()[0]
        return {
            'billing_frequency': plan.billing_frequency,
            'price': plan.price,
        }
    except Exception as e:
        print e
        return None


def is_premium_user(user):
    custmr = lookup_customer(user)
    if custmr.subscription_id == "":
        return False
    response = braintree.Subscription.find(custmr.subscription_id)
    return response.status == braintree.Subscription.Status.Active
