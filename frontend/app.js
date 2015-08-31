var app = angular.module('dentest', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'auth', 'questions', 'globalConstants']);

angular.module('dentest').config(function($routeProvider) {

    $routeProvider.when('/',{templateUrl: 'partial/home-screen-partial/home-screen-partial.html'});
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/'});

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


