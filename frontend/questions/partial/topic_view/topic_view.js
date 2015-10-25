angular.module('questions').controller('TopicViewCtrl',['$routeParams','QuestionService',
    function($routeParams,QuestionService){
        var self = this;

        self.topic_name = $routeParams.topic_name;
        self.topic = {};
        self.topic_not_found = false;


        var fetch_topic = function(){
            QuestionService.getTopic(self.topic_name).then(
                function(response){
                    self.topic = response;
                },
                function(error){
                    self.topic_not_found = true;
                }
            );
        };
        fetch_topic();
}]);