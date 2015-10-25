angular.module('questions').controller('SubtopicViewCtrl',['$routeParams','QuestionService',
    function($routeParams,QuestionService){
        var self = this;

        self.topic_name = $routeParams.topic_name;
        self.subtopic_name = $routeParams.subtopic_name;
        self.subtopic = {};
        self.subtopic_not_found = false;


        var fetch_subtopic = function(){
            QuestionService.getSubtopic(self.topic_name,self.subtopic_name).then(
                function(response){
                    self.subtopic = response;
                },
                function(error){
                    self.subtopic_not_found = true;
                }
            );
        };
        fetch_subtopic();
}]);