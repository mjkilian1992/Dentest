angular.module('questions', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate']);

angular.module('questions').config(function($routeProvider) {

    $routeProvider.when('/topic_choices', {
        templateUrl: 'questions/partial/topic_navigator/topic_navigator.html',
        resolve: {
            default_page_size: ['QuestionService', function (QuestionService) {
                QuestionService.set_page_size(1000000); //force all subtopics onto one page
            }],
        },
        restricted: true
    });

    $routeProvider.when('/question_no/:number', {
        templateUrl: 'questions/partial/question_by_id_view/question_by_id_view.html',
        restricted: true
    });

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
        restricted: true
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
        restricted: true
    });
    $routeProvider.when('/questions/:topic/:subtopic',{
        templateUrl: 'questions/partial/main_question_viewer/main_question_viewer.html',
        controller:'MainQuestionViewerCtrl',
        controllerAs:'questionCtrl',
        resolve: {
            default_page_size: ['QuestionService', function (QuestionService) {
                //TODO Work out page size for users screen
                QuestionService.set_page_size(50);
            }],
        },
        restricted: true
    });

    $routeProvider.when('/topic/:topic_name',{
        templateUrl: 'questions/partial/topic_view/topic_view.html',
        restricted: true
    });

    $routeProvider.when('/subtopic/:topic_name/:subtopic_name',{
        templateUrl: 'questions/partial/subtopic_view/subtopic_view.html',
        restricted: true
    });
    /* Add New Routes Above */

});

