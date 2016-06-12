angular.module('subscriptions').directive('braintreePaymentForm', ['$location','Notification','SubscriptionService', function ($location,Notification,SubscriptionService) {
    return {
        restrict: 'E',
        templateUrl: 'subscriptions/directive/braintree_payment_form/braintree_payment_form.html',
        scope: {
            newSubscription: '@'
        },
        link: function (scope, element, attrs) {
            var clientToken = SubscriptionService.get_token();

            var callService = function(nonce){
                if(scope.newSubscription=='true'){
                    SubscriptionService.subscribe(nonce);
                    Notification.success({
                        title:"Thank you for subscribing!",
                        message:"You now have access to all of Dentest's features",
                        delay:15000
                    });
                    SubscriptionService.init();
                    $location.path('/manage_subscription');
                }else{
                    SubscriptionService.change_payment_method(nonce);
                    Notification.success({
                        title:"Payment method changed successfully",
                        message:"Your next payment will be taken using this new method.",
                        delay:15000
                    });
                    $location.path('/manage_subscription');
                }
            };

            var unpackBraintreeObject = function(payment_object){
                nonce = payment_object.nonce;
                callService(nonce);

            };

            braintree.setup(clientToken, "dropin", {
                container: "payment-form",
                onPaymentMethodReceived: unpackBraintreeObject
            });
        }
    }
}]);
