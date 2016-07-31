angular.module('subscriptions',
    [
        'ui.bootstrap',
        'ui.utils',
        'ngRoute',
        'ngAnimate',
        'ngCookies',
        'ui-notification',
    ]);

angular.module('subscriptions').config(function($routeProvider) {
    $routeProvider.when('/subscribe',{
        templateUrl: 'subscriptions/partial/subscribe/subscribe.html',
        restricted: true,
        resolve: {
            'clientToken': function(SubscriptionService){
                return SubscriptionService.init();
            }
        }
    });

    $routeProvider.when('/change_payment_method',{
        templateUrl: 'subscriptions/partial/change_payment_method/change_payment_method.html',
        restricted: true
    });
    $routeProvider.when('/subscribe_success',{templateUrl: 'subscriptions/partial/subscription_sucess/subscription_sucess.html'});
    $routeProvider.when('/change_payment_method_success',{templateUrl: 'subscriptions/partial/change_payment_method_success/change_payment_method_success.html'});
    /* Add New Routes Above */
    $routeProvider.when('/manage_subscription',{
        templateUrl: 'subscriptions/partial/subscription_status/subscription_status.html',
        restricted: true,
        resolve: {
            'clientToken': function(SubscriptionService){
                return SubscriptionService.init();
            }
        }
    });


});

