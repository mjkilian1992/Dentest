angular.module('auth',
    [
        'ui.bootstrap',
        'ui.utils',
        'ngRoute',
        'ngAnimate'
    ]);

angular.module('auth').config(function ($routeProvider) {

    $routeProvider.when('/login', {templateUrl: 'auth/partial/login_form/login_form.html'});
    $routeProvider.when('/signup',{templateUrl: 'auth/partial/registraion_form/registraion_form.html'});
    $routeProvider.when('/password_reset',{templateUrl: 'auth/partial/password_reset_form/password_reset_form.html'});
    $routeProvider.when('/password_reset_request_success',{templateUrl: 'auth/partial/password_reset_request_success/password_reset_request_success.html'});
    $routeProvider.when('/password_reset_confirm/:username/:token',{templateUrl: 'auth/partial/password_reset_confirm_form/password_reset_confirm_form.html'});
    /* Add New Routes Above */

});

