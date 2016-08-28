import braintree
import settings
import logging
import pytz, datetime

from dentest import settings as server_settings

from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist, MultipleObjectsReturned
from subscriptions.models import BraintreeUser
from braintree.customer import Customer

LOGGER = logging.getLogger(__name__)

class BraintreeError(Exception):
    pass

class SubscriptionManager(object):

    @classmethod
    def fetch_braintree_user(cls,user):
        """
        Look up the BraintreeUser instance connected to the provided user. Raises a BraintreeError if a BraintreeUser
        cannot be found for this user.
        """
        try:
            braintree_user = BraintreeUser.objects.get(user=user)
        except ObjectDoesNotExist as e:
            LOGGER.exception("No braintree account associated with user %s. Must create one!",user)
            raise BraintreeError("No instance of BraintreeUser found associated with user " + str(user))
        except MultipleObjectsReturned as e:
            LOGGER.exception("Multiple braintree accounts associated with user %s", user)
            raise BraintreeError("Multiple BraintreeUser instances attached to this user " + str(user))
        return braintree_user

    @classmethod
    def create_new_customer(cls,user):
        """
        Create a new Braintree Customer for the user and store their Braintree ID linked to their Django user.
        Returns the braintree Customer for the user iof successful
        """
        # Check this user does not already have a Braintree ID
        if len(BraintreeUser.objects.filter(user=user)) > 0:
            LOGGER.error("Tried to create a duplicate braintree account for user %s", user)
            raise BraintreeError("This user already has a BraintreeUser instance associated with them. User: " + str(user))

        result = Customer.create({
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        })
        if not result.is_success:
            return None

        id = result.customer.id
        customerRef = BraintreeUser(
            user=user,
            customer_id=id,
            active = False,
            pending_cancel = False
        )
        customerRef.save()
        return customerRef

    @classmethod
    def subscribe(cls,braintree_customer):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")
        elif braintree_customer.payment_method_token is None or braintree_customer.customer_id is None:
            raise BraintreeError("Provided BraintreeUser instance not initialized properly: " + str(braintree_customer))
        elif braintree_customer.active:
            raise BraintreeError("User is already subscribed : " + str(braintree_customer.user.username))

        # try to subscribe with Braintree
        payment_method_token = braintree_customer.payment_method_token
        result = braintree.Subscription.create({
            'payment_method_token': payment_method_token,
            'plan_id': settings.SUBSCRIPTION_PLAN_ID,
            'first_billing_date' : cls.construct_next_billing_datetime()
        })

        if not result.is_success:
            LOGGER.exception("Could not subscribed user %s. Reason: %s", str(braintree_customer.user), str(result.errors.deep_errors))
            raise BraintreeError("Could not subscribe user: " + str(braintree_customer.user.username) + ". Reason: " + str(result.errors.deep_errors))

        subscription = result.subscription
        # Check that the subscription is active

        # billing period end date will be None if the subscription is in the future
        if(subscription.billing_period_end_date is not None):
            braintree_customer.expiry_date = cls.convert_braintree_time_to_server_time(subscription.billing_period_end_date)
        braintree_customer.subscription_id = subscription.id
        braintree_customer.active = cls.is_braintree_subscription_active(subscription)
        braintree_customer.save()
        return subscription.id


    @classmethod
    def renew(cls,braintree_customer):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")

        # If user is already subscribed we cant renew
        # first handle case where user isnt active (dont have a valid subscription) - default to subscribe case
        if not braintree_customer.active:
            return cls.subscribe(braintree_customer)
        elif braintree_customer.pending_cancel:
            # user has cancelled but the subscription is still valid - just remove the pending cancellation
            braintree_customer.pending_cancel = False
            braintree_customer.save()
            return braintree_customer.subscription_id
        else :
            raise BraintreeError("User already subscribed - cannot renew: " + str(braintree_customer.user.username))


    @classmethod
    def request_cancel(cls,braintree_customer):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")

        # Put in a cancel request for a user if there isnt one already
        if braintree_customer.subscription_id == "" or braintree_customer.customer_id == "":
            raise BraintreeError("Customer does not have a subscription to cancel")
        elif braintree_customer.pending_cancel:
            return False
        else:
            braintree_customer.pending_cancel = True
            braintree_customer.save()
            return True

    @classmethod
    def cancel_on_braintree(cls,braintree_customer):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")
        # try to cancel
        response = braintree.Subscription.cancel(braintree_customer.subscription_id)
        if not response.is_success:
            raise BraintreeError("Could not cancel subscription " + str(braintree_customer.subscription_id) +
                                 " for user " + str(braintree_customer.user.username) + ". May have to cancel manually")
        braintree_customer.active = False
        braintree_customer.subscription_id = ""
        braintree_customer.pending_cancel = False
        braintree_customer.expiry_date = None
        braintree_customer.save()


    @classmethod
    def change_payment_method(cls,braintree_customer, payment_method_nonce):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")
        # try to create the payment method on Braintree
        response = braintree.PaymentMethod.create({
            'customer_id': braintree_customer.customer_id,
            'payment_method_nonce': payment_method_nonce,
            'options':{
                'make_default' : True
            }
        })

        # Check the change went through
        if not response.is_success:
            raise BraintreeError("Could not reach Braintree to change payment method for user: " + str(braintree_customer.user.username))

        braintree_customer.payment_method_token = response.payment_method.token
        braintree_customer.save()

        # Now try to change the payment method on the users subscription (if they have one)
        if braintree_customer.subscription_id != "":
            response = braintree.Subscription.update(braintree_customer.subscription_id,{
                'payment_method_token' : braintree_customer.payment_method_token
            })

            if not response.is_success:
                raise BraintreeError("Managed to create a new payment method for " + str(braintree_customer.user.username) +
                                     " but could not change their subscription to use this. Reason: " + str(response.errors.deep_errors))

        return True


    @classmethod
    def fetch_subscription_from_braintree(cls,braintree_customer):
        if not isinstance(braintree_customer,BraintreeUser):
            raise TypeError("braintree_customer must be instance of BraintreeUser")
        elif braintree_customer.subscription_id == "" or braintree_customer.subscription_id is None:
            raise BraintreeError("User does not have a Braintree subscription: " + str(braintree_customer.user.username))

        # try to fetch from braintree
        try:
            result = braintree.Subscription.find(braintree_customer.subscription_id)
            return result
        except Exception as e:
            LOGGER.error("Could not fetch Braintree state for user: %s",str(braintree_customer.user))
            raise BraintreeError("Could not fetch state for user " + str(braintree_customer.user) + " with braintree details " +
                                 str(braintree_customer) + "!")

    @classmethod
    def get_account_info_for_user(cls,user):
        try:
            account = BraintreeUser.objects.get(user=user)
            return account
        except ObjectDoesNotExist, MultipleObjectsReturned:
            return None

    @classmethod
    def can_user_access_subscription_content(cls,user):
        if user.is_staff:
            return True
        account = SubscriptionManager.get_account_info_for_user(user)
        if account is None:
            return False
        else:
            return account.active


    @classmethod
    def get_subscription_plan(cls):
        try:
            plan = braintree.Plan.all()[0]
            return {
                'billing_frequency': plan.billing_frequency,
                'price': plan.price,
            }
        except Exception as e:
            LOGGER.exception("Could not fetch the subscription plan from Braintree.")
            return None

    @classmethod
    def convert_braintree_time_to_server_time(cls,braintree_timestamp):
        local = pytz.timezone(settings.BRAINTREE_TIME_ZONE)
        server = pytz.timezone(server_settings.TIME_ZONE)
        local_dt = local.localize(braintree_timestamp, is_dst=None)
        return local_dt.astimezone(server)


    @classmethod
    def construct_next_billing_datetime(cls):
        today = timezone.now().date()
        tommorrow_midnight = timezone.datetime.combine(today, datetime.time()) + timezone.timedelta(days=1)
        return tommorrow_midnight


    @classmethod
    def is_braintree_subscription_active(cls,subscription):
        status = subscription.status
        return status == braintree.Subscription.Status.Active or status == braintree.Subscription.Status.Pending

    @classmethod
    def is_braintree_subscription_in_terminating_state(cls,subscription):
        status = subscription.status
        return status != braintree.Subscription.Status.PastDue and (status == braintree.Subscription.Status.Canceled or braintree.Subscription.Status.Expired)

    @classmethod
    def convert_subscription_status_to_string(cls,status):
        if status == braintree.Subscription.Status.Active:
            return "Active"
        elif status == braintree.Subscription.Status.Pending:
            return "Pending"
        elif status == braintree.Subscription.Status.PastDue:
            return "Problem collecting payment"
        elif status == braintree.Subscription.Status.Canceled:
            return "Cancelled"
        else:
            return "Expired"