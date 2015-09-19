angular.module('auth',
    [
        'ui.bootstrap',
        'ui.utils',
        'ngRoute',
        'ngAnimate'
    ]);

angular.module('auth').config(function ($routeProvider) {

    $routeProvider.when('/signup',{templateUrl: 'auth/partial/reg_and_login_tabbed_view.html'});
    $routeProvider.when('/password_reset',{templateUrl: 'auth/partial/password_reset_form/password_reset_form.html'});
    $routeProvider.when('/password_reset_request_success',{templateUrl: 'auth/partial/password_reset_request_success/password_reset_request_success.html'});
    $routeProvider.when('/password_reset_confirm/:username/:token',{templateUrl: 'auth/partial/password_reset_confirm_form/password_reset_confirm_form.html'});
    $routeProvider.when('/email_activation/:username/:token',{templateUrl: 'auth/partial/email_confirmation_form/email_confirmation_form.html'});
    $routeProvider.when('/update_profile',{templateUrl: 'auth/partial/update_profile/update_profile.html'});
    $routeProvider.when('/signup_success',{templateUrl: 'auth/partial/registration_success.html'});
    /* Add New Routes Above */

});

