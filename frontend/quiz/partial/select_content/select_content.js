angular.module('quiz').controller('SelectContentCtrl',['QuestionService',function(QuestionService){
    var self = this;

    self.topic_list = [];

    //Initialise list of values
    QuestionService.getSubtopics(1).then(function(results){
        var temp_topic_list = QuestionService.structureSubtopicsHierarchically(results);
        //need to add a boolean field to each one for checkbox effect
        for( var i =0; i < temp_topic_list.length; i++){
            var topic_obj = temp_topic_list[i];
            var subtopic_list = [];
            for(var j = 0; j < topic_obj.subtopics.length; j++){
                var subtopic_obj = {};
                var subtopic_name = topic_obj.subtopics[j];
                subtopic_obj.name = subtopic_name;
                subtopic_obj.include = false;
                subtopic_list.push(subtopic_obj);
            }
            topic_obj.subtopics = subtopic_list;
            topic_obj.include = false;
        }
        self.topic_list = temp_topic_list;
        console.log(self.topic_list);
    },
    function(results){
        self.topic_list = [];

    });


    /* When a topic is selected for inclusion, it should include/uninclude all of its subtopics. This method acheives this.*/
    self.selectTopic = function(topic_name){
        angular.forEach(self.topic_list, function(topic_obj){
            if(topic_obj.topic===topic_name){
                //Change all subtopics to match new topic inclusion value
                angular.forEach(topic_obj.subtopics, function(subtopic_obj){
                    subtopic_obj.include = topic_obj.include;
                });
                return;
            }
        });

    };
}]);