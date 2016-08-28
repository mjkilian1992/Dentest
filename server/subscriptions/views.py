import braintree
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from subscription_manager import SubscriptionManager, BraintreeError
import traceback
import logging

LOGGER = logging.getLogger(__name__)

class GenerateClientTokenView(APIView):

    def get(self,request,format='json'):
        try:
            token = braintree.ClientToken.generate()
            return Response({'token':token},status=status.HTTP_200_OK)
        except:
            return Response({'errors':['Braintree client token could not be generated']},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubscriptionCreationView(APIView):
    """
    View for creating a subscription for a user. Assumes they have a payment method already set up (and throws an
    error if no payment method can be found
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format='json'):
        try:
            braintree_user = SubscriptionManager.fetch_braintree_user(request.user)
        except BraintreeError as e:
            return Response({'errors':["User  not initialized properly. Please contact support"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if braintree_user.payment_method_token is None or braintree_user.payment_method_token == "":
            return Response({'errors':["User must set up a payment method first"]}, status=status.HTTP_400_BAD_REQUEST)

        try:
            SubscriptionManager.subscribe(braintree_user)
            LOGGER.info("New subscription created for user %s",str(self.request.user))
            return Response({},status.HTTP_201_CREATED)
        except BraintreeError as e:
            LOGGER.error("Failed to subscribed user %s", str(self.request.user))
            return Response({'errors':["Could not create subscription. Please try again."]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            LOGGER.exception("Unknown exception in subscription creation.")
            return Response({'errors':[e.message]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubscriptionRenewalView(APIView):
    """
    View for renewing a subscription. Fails if:
        - The user is already subscribed
        - There isnt a valid payment method for the user
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format='json'):
        try:
            braintree_user = SubscriptionManager.fetch_braintree_user(request.user)
        except BraintreeError:
            return Response({'errors':["User not initialized properly. Please contact support"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            SubscriptionManager.renew(braintree_user)
            LOGGER.info("Renewed subscription for user %s",str(self.request.user))
            return Response({}, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            LOGGER.exception("Unknown exception in subscription renewal.")
            return Response({'errors':[e.message]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SubscriptionCancelView(APIView):
    """
    View for a user to request their subscription be cancelled
    """
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format='json'):
        try:
            braintree_user = SubscriptionManager.fetch_braintree_user(request.user)
        except BraintreeError:
            return Response({'errors':["User not initialized properly. Please contact support"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            SubscriptionManager.request_cancel(braintree_user)
            return Response({},status=status.HTTP_202_ACCEPTED)
        except BraintreeError as e:
            LOGGER.exception("Failed to move subscription for %s to pending cancel.",str(self.request.user))
            return Response({'errors':[e.message]},status=status.HTTP_400_BAD_REQUEST)



class SubscriptionStatusView(APIView):
    """
    View for retireving information about the user's subscription
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self,request,format='json'):
        # First fetch the users braintree account
        try:
            braintree_user = SubscriptionManager.fetch_braintree_user(request.user)
        except BraintreeError:
            return Response({'errors':["User's account is not set up correctly. Please contact support"]},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        subscription_info = {}
        # First case to handle is when user does not have a subscription
        if braintree_user.subscription_id == "" or braintree_user.subscription_id is None:
            return Response({'user_not_subscribed':True},status=status.HTTP_200_OK)

        # Further cases will require info from braintree
        try:
            subscription_obj = SubscriptionManager.fetch_subscription_from_braintree(braintree_user)
        except BraintreeError:
            LOGGER.exception("Could not fetch user info from braintree!")
            return Response({'errors': ["Something went wrong. Please try again later"]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        sub_status = SubscriptionManager.convert_subscription_status_to_string(subscription_obj.status)
        first_billing_date = subscription_obj.billing_period_start_date
        next_billing_or_cancel_date = subscription_obj.billing_period_end_date
        created_at = subscription_obj.created_at
        price = subscription_obj.price

        if braintree_user.pending_cancel:
            sub_status = "Pending Cancellation"

        subscription_info["status"] = sub_status
        subscription_info["first_billing_date"] = first_billing_date
        subscription_info["renewal_or_cancel_date"] = next_billing_or_cancel_date
        subscription_info["date_of_creation"] = created_at
        subscription_info["price"] = price

        return Response(subscription_info, status=status.HTTP_200_OK)



class SubscriptionChangePaymentMethodView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format='json'):
        try:
            braintree_user = SubscriptionManager.fetch_braintree_user(request.user)
        except BraintreeError as e:
            return Response({'errors':["User's account is not set up correctly. Please contact support"]},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if 'payment_method_nonce' not in request.data:
            return Response({'errors':["No payment details provided."]},status=status.HTTP_400_BAD_REQUEST)
        payment_method_nonce = request.data['payment_method_nonce']

        try:
            SubscriptionManager.change_payment_method(braintree_user,payment_method_nonce)
            return Response({},status=status.HTTP_202_ACCEPTED)
        except BraintreeError as e:
            LOGGER.exception("Failed to change user %s payment method",str(self.request.user))
            return Response({'errors':["Could not change payment method! Please try again."]},status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class PlanInfoView(APIView):
    """
    Retrieve information about the subscription plan for the app. All users will share the same plan.
    """
    permission_classes = (permissions.IsAuthenticated,)

    def get(self,request,format='json'):
        plan = SubscriptionManager.get_subscription_plan()
        if plan is None:
            return Response({'errors':['No subscription plan found']},status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(plan,status=status.HTTP_200_OK)