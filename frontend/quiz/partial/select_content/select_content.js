angular.module('quiz').controller('SelectContentCtrl',['TopicSelectionService','$location', function(TopicSelectionService,$location){

    var self = this;

    self.topic_list = [];
    self.maxQuestions = 30;

    var init = function(){
        console.log("INIT CALLED");
        TopicSelectionService.getCleanTopicList().then(function(result){
            self.topic_list = TopicSelectionService.topic_list;
            console.log(self.topic_list);
        });
    };
    init();


    self.selectSubtopicsOfTopic = function(topic_name){
        TopicSelectionService.selectSubtopicsOfTopic(topic_name);
        self.topic_list = TopicSelectionService.topic_list;
    };

    self.generateNewQuiz = function(){
        TopicSelectionService.topic_list = self.topic_list;
        $location.url('/quiz/' + self.maxQuestions);
    };

}]);