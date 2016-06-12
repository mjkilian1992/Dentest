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

