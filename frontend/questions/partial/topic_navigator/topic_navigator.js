angular.module('questions').controller('TopicNavigatorCtrl', ['QuestionService',
    function (QuestionService) {
        var self = this;

        self.topic_list = [];
        self.error = false;
        self.raw_subtopics = [];

        var structure_topics = function () {
            QuestionService.getSubtopics(1).then(
                function (results) {
                    self.topic_list = QuestionService.structureSubtopicsHierarchically(results);

                }, function (result) {
                    self.error=true;
                }
            );
        };
        structure_topics();
    }]);
