from datetime import timedelta
from django.conf import settings
from django.utils import timezone
from django.db import models
from django.db.models import Q


class EmailConfirmationManager(models.Manager):
    """Manager for EmailConfirmations"""

    def all_expired(self):
        """Returns all activation codes which have expired"""
        return self.filter(self.expired_q())

    def all_valid(self):
        """Returns all activation codes which are still usable (havent expired yet)"""
        return self.exclude(self.expired_q())

    def expired_q(self):
        """Returns queryset of expired Confirmations"""
        days_valid = getattr(settings,'EMAIL_CONFIRMATION_DAYS_VALID')
        sent_threshold = timezone.now() \
            - timedelta(days=days_valid)
        return Q(time_sent__lt=sent_threshold)

    def delete_expired_confirmations(self):
        """Removes all expired confirmations from the database"""
        self.all_expired().delete()


class PasswordResetManager(models.Manager):
    """Manager for PasswordResets"""

    def all_expired(self):
        """REturns all expired PasswordReset requests"""
        return self.filter(self.expired_q())

    def all_valid(self):
        """Returns all PasswordReset requests which have not yet expired"""
        return self.exclude(self.expired_q())

    def expired_q(self):
        """Returns a queryset of all expired Resets"""
        days_valid = getattr(settings,'PASSWORD_RESET_DAYS_VALID')
        sent_threshold = timezone.now() \
            - timedelta(days=days_valid)
        return Q(time_sent__lt=sent_threshold)

    def delete_expired_resets(self):
        """Deletes all expired resets from the database"""
        self.all_expired().delete()