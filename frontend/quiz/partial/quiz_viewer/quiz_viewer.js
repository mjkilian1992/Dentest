angular.module('quiz').controller('QuizViewerCtrl',['QuestionService','TopicSelectionService','Notification','$routeParams', function(QuestionService, TopicSelectionService,Notification, $routeParams){
    var self = this;

    self.questions = [];
    self.error = false;

    self.getQuestions = function(){
        //Instantiate by fetching questions from Server through question service
        QuestionService.getQuizByTopics(TopicSelectionService.processTopicsForBackend(),$routeParams.max_questions)
            .then(function(response){
                self.questions = response;
            },function(response){
                self.error  = true;
            }
        );

        //If not enough questions were available, let the user know
        if(self.questions.length < $routeParams.max_questions){
            Notification.warning({
                title:"Not enough questions available!",
                message:"There were not enough questions in the selected topics to generate a quiz of " +
                $routeParams.max_questions + " questions. The generated quiz has " + self.questions.length + " questions.",
            });
        }
    };

    self.getQuestions();


}]);