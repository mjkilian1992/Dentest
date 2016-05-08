from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from subscriptions.customer_management import *

class SubscriptionCreationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format='json'):
        try:
            payment_method_nonce = request.data['payment_method_nonce']
        except KeyError as e:
            return Response({'errors':['No payment method provided.']},status=status.HTTP_402_PAYMENT_REQUIRED)
        result = add_payment_method(request.user,payment_method_nonce)
        if not result:
            return Response({'errors':['Could not create payment method.']},status=status.HTTP_400_BAD_REQUEST)
        try:
            subscription_created = create_dentest_subscription(request.user,result)
        except BraintreeError as e:
            return Response({'errors':['User already has an open subscription.']},status=status.HTTP_400_BAD_REQUEST)
        if not subscription_created:
            return Response({'errors':['Subscription could not be created. Please check payment details']},status=status.HTTP_400_BAD_REQUEST)
        return Response({},status=status.HTTP_201_CREATED)

class SubscriptionCancelView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self,request,format='json'):
        try:
            cancel_dentest_subscription(request.user)
            return Response({},status=status.HTTP_202_ACCEPTED)
        except braintree.exceptions.not_found_error.NotFoundError as e:
            return Response({'errors':['User does not have an active subscription']},status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print e
