var app = angular.module('dentest', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'auth']);

angular.module('dentest').config(function($routeProvider) {

    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});

angular.module('dentest').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});

app.constant('REST_BASE_URL','https://dentest.com')
