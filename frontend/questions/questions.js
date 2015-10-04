angular.module('questions', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate']);

angular.module('questions').config(function($routeProvider) {

    $routeProvider.when('/questions', {
        templateUrl: 'questions/partial/main_question_viewer/main_question_viewer.html',
        controller:'MainQuestionViewerCtrl',
        controllerAs:'questionCtrl',
        resolve: {
            default_page_size: ['QuestionService', function (QuestionService) {
                //TODO Work out page size for users screen
                QuestionService.set_page_size(1);
            }],
        },
    });
    $routeProvider.when('/questions/:topic',{
       templateUrl: 'questions/partial/main_question_viewer/main_question_viewer.html',
        controller:'MainQuestionViewerCtrl',
        controllerAs:'questionCtrl',
        resolve: {
            default_page_size: ['QuestionService', function (QuestionService) {
                //TODO Work out page size for users screen
                QuestionService.set_page_size(50);
            }],
        },
    });
    $routeProvider.when('questions/:topic/:subtopic',{
        templateUrl: 'questions/partial/main_question_viewer/main_question_viewer.html',
        controller:'MainQuestionViewerCtrl',
        controllerAs:'questionCtrl',
        resolve: {
            default_page_size: ['QuestionService', function (QuestionService) {
                //TODO Work out page size for users screen
                QuestionService.set_page_size(50);
            }],
        },
    });
    /* Add New Routes Above */

});

