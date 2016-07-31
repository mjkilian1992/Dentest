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
                    SubscriptionService.init();
                    $location.path('/subscribe_success');
                }else{
                    SubscriptionService.change_payment_method(nonce);
                    $location.path('/change_payment_method_success');
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
