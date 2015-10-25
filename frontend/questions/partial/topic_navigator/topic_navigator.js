angular.module('questions').controller('TopicNavigatorCtrl', ['QuestionService',
    function (QuestionService) {
        var self = this;

        self.topic_list = [];
        self.error = false;
        self.raw_subtopics = [];

        var structure_topics = function () {
            QuestionService.getSubtopics(1).then(
                function (results) {
                    console.log(results);
                    var temp_topic_list = {};

                    //strip out topics and subtopics
                    for (var i = 0; i < results.length; i++) {
                        var topic = results[i].topic;
                        if (topic in temp_topic_list) {
                            temp_topic_list[topic].push(results[i].name);
                        } else {
                            temp_topic_list[topic] = [results[i].name];
                        }
                    }

                    //now build into a list of objects
                    for(topic in temp_topic_list){
                        var top_obj = {};
                        top_obj.topic = topic;
                        top_obj.subtopics = temp_topic_list[topic];
                        self.topic_list.push(top_obj);
                    }

                }, function (result) {
                    self.error=true;
                }
            );
        };
        structure_topics();
    }]);
