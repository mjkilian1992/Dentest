angular.module('questions').service('QuestionService', ['$http', '$q', 'REST_BASE_URL', function ($http, $q, REST_BASE_URL) {
    var self = this;

    var build_query_params = function (page_number, page_size) {
        /**Convenience method for building query parameters*/
        return {
            format: 'json',
            page: page_number,
            page_size: page_size,
        };
    };
    //====================PAGINATION CONFIG AND STATE=============================
    var page_size = 50; //Can replace this with clever method later

    var pagination_info = {
        no_of_items: 0,
        no_of_pages: null,
        current_page_number: null,
        next_page_number: null,
        previous_page_number: null,
        next_page_link: null,
        previous_page_link: null,
    };

    /**====================PAGINATION METHODS===================================*/

    self.get_page_size = function () {
        return page_size;
    };

    self.set_page_size = function (size) {
        page_size = size;
    };

    self.get_pagination_info = function () {
        return pagination_info;
    };

    self.clear_pagination_info = function () {
        pagination_info.no_of_items = 0;
        pagination_info.no_of_pages = null;
        pagination_info.current_page_number = null;
        pagination_info.next_page_number = null;
        pagination_info.next_page_link = null;
        pagination_info.previous_page_number = null;
        pagination_info.previous_page_link = null;
    };

    self.build_pagination_info = function (request_page_number, response) {
        pagination_info.no_of_items = response.count;
        pagination_info.next_page_link = response.next;
        pagination_info.previous_page_link = response.previous;
        pagination_info.current_page_number = request_page_number;
        if (response.next == null) {
            pagination_info.next_page_number = null;
        } else {
            pagination_info.next_page_number = request_page_number + 1;
        }
        if (response.previous == null) {
            pagination_info.previous_page_number = null;
        } else {
            pagination_info.previous_page_number = request_page_number - 1;
        }
        pagination_info.no_of_pages = Math.ceil(Number(response.count) / page_size);
    };

    self.next_page = function () {
        var deferred = $q.defer();
        if (pagination_info.next_page_number == null) {
            deferred.reject({errors: ['There is no a next page.']});
        } else {
            $http.get(pagination_info.next_page_link)
                .then(function (response) { //success
                    self.build_pagination_info(pagination_info.current_page_number + 1, response.data);
                    deferred.resolve(response.data.results);
                }, function (response) { //failure
                    deferred.reject(response.data);
                });
        }
        return deferred.promise;
    };

    self.previous_page = function () {
        var deferred = $q.defer();
        if (pagination_info.previous_page_number == null) {
            deferred.reject({errors: ['There is no previous page.']});
        } else {
            $http.get(pagination_info.previous_page_link)
                .then(function (response) { //success
                    self.build_pagination_info(pagination_info.current_page_number - 1, response.data);
                    deferred.resolve(response.data.results);
                }, function (response) { //failure
                    deferred.reject(response.data);
                });
        }
        return deferred.promise;
    };

    //========================API CONFIG==============================
    var api_urls = {
        topics: REST_BASE_URL + '/topics/',
        single_topic: REST_BASE_URL + '/topic/',
        subtopics: REST_BASE_URL + '/subtopics/',
        single_subtopic: REST_BASE_URL + '/subtopic/',
        questions: REST_BASE_URL + '/questions/',
        questions_by_topic: REST_BASE_URL + '/questions/by_topic/',
        questions_by_subtopic: REST_BASE_URL + '/questions/by_subtopic/',
        question_by_id: REST_BASE_URL + '/questions/question_number/',
        question_search: REST_BASE_URL + '/questions_search/',
        quiz: REST_BASE_URL + '/quiz/'
    };

    //========================GET TOPICS==============================
    self.getTopics = function (page_number) {
        var deferred = $q.defer();
        $http.get(api_urls.topics, {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //====================GET SINGLE TOPIC============================
    self.getTopic = function(topicName){
        var deferred = $q.defer();
        $http.get(api_urls.single_topic + topicName + '/?format=json')
            .then(function (response) { //success
                deferred.resolve(response.data);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //========================GET SUBTOPICS===========================
    self.getSubtopics = function (page_number) {
        var deferred = $q.defer();
        $http.get(api_urls.subtopics, {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    self.getAllSubtopics = function(){
        var deferred = $q.defer();
        $http.get(api_urls.subtopics, {params: build_query_params(1, 1000000)})
            .then(function (response) { //success
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    }

    //====================GET SINGLE SUBTOPIC============================
    self.getSubtopic = function(topicName,subtopicName){
        var deferred = $q.defer();
        $http.get(api_urls.single_subtopic + topicName + '/' + subtopicName + '/?format=json')
            .then(function (response) { //success
                deferred.resolve(response.data);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

     //=====================PROCESS SUBTOPICS INTO HIERARCHY==============
    self.structureSubtopicsHierarchically = function(getSubtopicsResponse){
        /*Processes the response of a getSubtopics call into a hierarchical grouping where subtopics are below topics*/
        var temp_topic_list = {};
        var topic_list = [];
        var results = getSubtopicsResponse;

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
            topic_list.push(top_obj);
        }
        return topic_list;
    };



    //=========================GET QUESTIONS==========================
    self.getQuestions = function (page_number) {
        var deferred = $q.defer();
        $http.get(api_urls.questions, {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //=======================GET QUESTIONS BY TOPIC====================
    self.getQuestionsByTopic = function (page_number, topic) {
        var deferred = $q.defer();
        $http.get(api_urls.questions_by_topic + topic + '/', {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //=======================GET QUESTIONS BY SUBTOPIC=================
    self.getQuestionsBySubtopic = function (page_number, topic, subtopic) {
        var deferred = $q.defer();
        $http.get(api_urls.questions_by_subtopic + topic + '/' + subtopic + '/',
            {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //=======================GET QUESTION BY ID========================
    self.getQuestionByID = function (question_number) {
        var deferred = $q.defer();
        $http.get(api_urls.question_by_id + question_number + '/',
            {params: {format: 'json'}})
            .then(function (response) { //success
                deferred.resolve(response.data);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    self.getQuestionsSearch = function(page_number,search_string) {
        var deferred = $q.defer();
        $http.get(api_urls.question_search + search_string + '/', {params: build_query_params(page_number, page_size)})
            .then(function (response) { //success
                self.build_pagination_info(page_number, response.data);
                deferred.resolve(response.data.results);
            }, function (response) { //failure
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    self.getQuizByTopics = function(topic_list,max_questions){
        var deferred = $q.defer();
        $http.post(api_urls.quiz + '?format=json', {topic_list:topic_list,max_questions:max_questions})
            .then(function(response){
                deferred.resolve(response.data);
            },    function(response){
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

}]);
