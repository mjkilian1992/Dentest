angular.module('questions').controller('QuestionByIdViewCtrl',['$routeParams','QuestionService',
    function($routeParams,QuestionService){
        var self = this;

        self.question_id = $routeParams.number;
        self.question = null;
        self.question_not_found = false;
        self.question_restricted = false;
        self.misc_error = null;

        var fetch_question = function(){
            QuestionService.getQuestionByID(self.question_id).then(
                function(response){
                    self.question = response;
                    self.misc_errors = [];
                },
                function(error){
                    self.question = null;
                    if(error.detail === 'Not found.'){
                        self.question_not_found = true;
                        self.question_restricted = false;
                    }else if(error.detail === 'Permission denied.'){ //Dont know why this comes in mispelled
                        self.question_not_found = false;
                        self.question_restricted = true;
                    }else{
                        self.misc_errors = "Unknown error(s). Could not fetch question." ;
                    }
                }
            );
        };
        fetch_question();


}]);