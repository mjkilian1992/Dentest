angular.module('questions').controller('MainQuestionViewerCtrl', ['QuestionService', '$routeParams',
    function (QuestionService, $routeParams) {

        var self = this;

        //Model Definition/Instantiation
        self.questions = [];
        self.errors = []; //Only really used in case where questions cant be pulled down.
        self.topic = $routeParams.topic || 'All';
        self.subtopic = $routeParams.subtopic || 'All';

        self.ui_page_number = 1;
        self.ui_total_items = null;
        self.ui_page_size = null;

        //Fetch questions
        var retrieve_questions = function (page_number) {
            if (self.topic !== 'All' && self.subtopic !== 'All') {
                QuestionService.getQuestionsBySubtopic(page_number, self.topic, self.subtopic).then(success, error);
            } else if (self.topic !== 'All' && self.subtopic === 'All') {
                QuestionService.getQuestionsByTopic(page_number, self.topic).then(success, error);
            } else {
                QuestionService.getQuestions(page_number).then(success, error);
            }
        };

        self.retrieve_questions = function(){
            return retrieve_questions(self.ui_page_number);
        };

        // ========================================= MAKE A CALL TO RETRIEVE QUESTIONS ON INSTANTIATION================
        self.retrieve_questions();

        //Pagination Navigators
        self.next_page = function () {
            if (self.current_page_number() >= self.no_of_pages()) {
                return null; //stop navigation past last page
            } else {
                QuestionService.next_page().then(success, error);
            }
        };

        self.previous_page = function () {
            if (self.current_page_number() <= 1) {
                return null; //stop navigation past first page
            } else {
                QuestionService.previous_page().then(success, error);
            }
        };

        //Pagination Getters (state stored by QuestionService)
        self.current_page_number = function () {
            self.ui_page_number = QuestionService.get_pagination_info().current_page_number;
            return self.ui_page_number;
        };

        self.page_size = function (page_size) {
            if (page_size != null) {
                //if the page size is changed dynamically, we need to re-display the questions
                //quickest way to do this is just to pull the questions down with new page size
                //starting from first page
                QuestionService.set_page_size(page_size);
                self.retrieve_questions(1);
            }
            self.ui_page_size = QuestionService.get_page_size();
            return self.ui_page_size;
        };

        self.no_of_items = function(){
            self.ui_total_items = QuestionService.get_pagination_info().no_of_items;
            return self.ui_total_items;
        };

        self.no_of_pages = function () {
            return QuestionService.get_pagination_info().no_of_pages;
        };

        //convenience methods for handling responses
        function success(response) {
            //synchronise page state
            self.page_size();
            self.no_of_items();
            self.current_page_number();

            self.questions = response;
            self.errors = [];
        }

        function error(response) {
            //synchronise page state
            self.page_size();
            self.no_of_items();
            self.current_page_number();

            self.questions = [];
            self.errors = [];
        }






    }
]);