from django.core.management.base import BaseCommand
from optparse import make_option
from subscriptions.managers import SubscriptionStatusManager as manager



class Command(BaseCommand):
    help = 'Synchronize database with braintree and cancel any subscriptions which are pending cancel'

    option_list = BaseCommand.option_list + (
        make_option("-s",
                    "--days-til-cancel",
                    action="store",
                    type="int",
                    dest="days_til_cancel",
                    default=1,
                    help='Set how many days a subscription must be from expiring before it is cancelled (default 1)'
        ),
    )


    def handle(self, *args, **options):
        manager.match_braintree_state()
        manager.cancel_all_pending_cancel(days_left=options['days_til_cancel'])