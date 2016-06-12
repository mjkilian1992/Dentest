angular.module('quiz', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate','questions']);

angular.module('quiz').config(function($routeProvider) {

    $routeProvider.when('/quiz/choose_content',{
        templateUrl: 'quiz/partial/select_content/select_content.html',
        premium:true
    });
    $routeProvider.when('/quiz/:max_questions',{
        templateUrl: 'quiz/partial/quiz_viewer/quiz_viewer.html',
        premium:true
    });
});

