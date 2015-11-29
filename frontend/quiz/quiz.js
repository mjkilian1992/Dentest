angular.module('quiz', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate','questions']);

angular.module('quiz').config(function($routeProvider) {

    $routeProvider.when('/quiz/choose_content',{templateUrl: 'quiz/partial/select_content/select_content.html'});
    /* Add New Routes Above */

});

