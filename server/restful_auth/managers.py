from datetime import timedelta
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db import models
from django.db.models import Q

class EmailConfirmationManager(models.Manager):

    def all_expired(self):
        return self.filter(self.expired_q())

    def all_valid(self):
        return self.exclude(self.expired_q())

    def expired_q(self):
        days_valid = getattr(settings,'EMAIL_CONFIRMATION_DAYS_VALID')
        sent_threshold = timezone.now() \
            - timedelta(days=days_valid)
        return Q(time_sent__lt=sent_threshold)

    def delete_expired_confirmations(self):
        self.all_expired().delete()

class PasswordResetManager(models.Manager):
    def all_expired(self):
        return self.filter(self.expired_q())

    def all_valid(self):
        return self.exclude(self.expired_q())

    def expired_q(self):
        days_valid = getattr(settings,'PASSWORD_RESET_DAYS_VALID')
        sent_threshold = timezone.now() \
            - timedelta(days=days_valid)
        return Q(time_sent__lt=sent_threshold)

    def delete_expired_resets(self):
        self.all_expired().delete()