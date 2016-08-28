import logging
from subscription_manager import *

LOGGER = logging.getLogger(__name__)

class SubscriptionStatusManager():
    """Manager for accessing subscription statuses"""

    @classmethod
    def match_braintree_state(cls):
        """
        Update all braintree customer info to make them synchronous with braintree
        """
        # Find all created subscriptions
        subscribed_users = BraintreeUser.objects.exclude(subscription_id="").exclude(subscription_id=None)
        for user in subscribed_users:
            try:
                subscription = SubscriptionManager.fetch_subscription_from_braintree(user)
                if SubscriptionManager.is_braintree_subscription_active(subscription):
                    user.active = True
                    user.expiry_date = subscription.billing_period_end_date
                elif SubscriptionManager.is_braintree_subscription_in_terminating_state(subscription):
                    user.subscription_id = ""
                    user.active = False
                    user.expiry_date = None
                    user.pending_cancel = False
                else:
                    user.active = False
                    user.expiry_date = subscription.billing_period_end_date
                user.save()
            except BraintreeError as e:
                LOGGER.exception("Could not match braintree state for user %s",user)

    @classmethod
    def cancel_all_pending_cancel(cls, days_left=1):
        """
        Cancel all susbcriptions that are about to be renewed where a Pending Cancel state has been reached.
        Does this by selecting all subscriptions that would expire within days_left number of days AFTER the next billing date
        :return:
        """
        threshold = timezone.make_aware(SubscriptionManager.construct_next_billing_datetime() +
                                        timezone.timedelta(days=days_left),pytz.utc)

        LOGGER.info("Threshold date for cancellation: %s",str(threshold))
        users_pending_cancel = BraintreeUser.objects.filter(pending_cancel=True).filter(expiry_date__lte=threshold)
        for user in users_pending_cancel:
            try:
                SubscriptionManager.cancel_on_braintree(user)
            except BraintreeError as e:
                LOGGER.exception("Could not cancel subscription for %s on braintree. Needs to be done manually!",user)



