from django.db import models
from django.contrib.auth.models import User

# Create your models here.
BRAINTREE_ID_LENGTH = 36

class BraintreeUser(models.Model):
    """
    Holds a mapping from Django User to their unique Braintree Customer ID. There can only be one ID per Django user.
    """
    user = models.ForeignKey(User,related_name='braintree_id',unique=True)
    customer_id = models.CharField(max_length=BRAINTREE_ID_LENGTH)