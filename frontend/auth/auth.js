angular.module('auth', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate']);

angular.module('auth').config(function($routeProvider) {

    $routeProvider.when('/login',{templateUrl: 'auth/partial/login_form/login_form.html'});
    /* Add New Routes Above */

});

