from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User

# from managers import SubscriptionStatusManager

# Create your models here.
BRAINTREE_ID_LENGTH = 36
SUBSCRIPTION_ID_LENGTH = 7


class BraintreeUser(models.Model):
    """
    Holds a mapping from Django User to their unique Braintree Customer ID. There can only be one ID per Django user.
    Also holds subscription status info
    """
    user = models.ForeignKey(User,related_name='braintree_id',unique=True)
    customer_id = models.CharField(max_length=BRAINTREE_ID_LENGTH)
    payment_method_token = models.CharField(max_length=BRAINTREE_ID_LENGTH,null=True)
    subscription_id = models.CharField(max_length=SUBSCRIPTION_ID_LENGTH,blank=True,default="")
    active = models.BooleanField(default=False, null=False)
    pending_cancel = models.BooleanField(default=False,null=False)
    expiry_date = models.DateTimeField(null=True,default=None,blank=True)

    # objects = SubscriptionStatusManager()

    def subscription_has_expired(self):
        return (not self.active) and self.expiry_date is not None and self.expiry_date < timezone.now()

    def __str__(self):
        return "BraintreeUser: {" + "User : " + str(self.user) + ", CustomerID: " + str(self.customer_id) \
            + ", SubscriptionID: " + str(self.subscription_id) \
            + ", PaymentMethodToken: " + str(self.payment_method_token) + ", Active: " + str(self.active) \
            + ", PendingCancel: " + str(self.pending_cancel) + ", ExpiryDate: " + str(self.expiry_date) + "}"



