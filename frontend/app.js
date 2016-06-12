var app = angular.module('dentest', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngCookies', 'ngAnimate', 'ui-notification', 'auth', 'questions', 'globalConstants', 'quiz', 'subscriptions']);

angular.module('dentest').config(['$routeProvider','$locationProvider','NotificationProvider',
    function($routeProvider,$locationProvider,NotificationProvider) {

    /* -----------------ROUTING ----------------------*/
    /*------------------Routes------------------------*/
    $routeProvider.when('/',{templateUrl: 'partial/home-screen-partial/home-screen-partial.html'});

    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/'});
    /*------------------HTML5 Mode Conf---------------*/
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');


    /*-----------------Notification Cong------------*/
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 60,
        startRight: 10,
        verticalSpacing: 20,
        horizontalSpacing: 20,
        positionX: 'left',
        positionY: 'top'
    });

}]);

//================================================RESTRICT ROUTING FOR ROUTE WHICH REQUIRE LOGIN======================/
angular.module('dentest').run(['$rootScope','$location','RestfulAuthService','SubscriptionService',
    function($rootScope,$location,RestfulAuthService,SubscriptionService){
        //Call an init in case the user is logged in by cookie
        SubscriptionService.init();

        //intercepts when a user tries to access restricted routes
        $rootScope.$on('$routeChangeStart', function (event, next) {
            var userAuthenticated = RestfulAuthService.is_logged_in(); /* Check if the user is logged in */
            var userSubscribed = SubscriptionService.is_subscribed;
            if (!userAuthenticated && next.restricted) {
                $location.path('/signup');
            }else if((!userAuthenticated || !userSubscribed) && next.premium){
                if(!userAuthenticated){
                    $location.path('/signup');
                }else{
                    $location.path('/manage_subscription');
                }
            }
        });
    }
]);



// Configure http to use cors (for testing purposes)
