describe('MainQuestionViewerCtrl', function () {

    //===============================TEST DATA=====================================
    var allQuestionsResponsePage1 = function (baseURL) {
        return {
            count: 4,
            next: baseURL + "/questions/?format=json&page=2&page_size=1",
            previous: null,
            results: [
                {
                    id: 1,
                    subtopic: {
                        topic: "Math",
                        name: "Algebra"
                    },
                    question: "if a=3 and b=4 what is a+b?",
                    answer: "7",
                    restricted: false
                }
            ]
        };
        ;
    }

    var allQuestionsResponsePage2 = function (baseURL) {
        return {
            count: 4,
            next: baseURL + "/questions/?format=json&page=3&page_size=1",
            previous: baseURL + "/questions/?format=json&page=1&page_size=1",
            results: [
                {
                    id: 1,
                    subtopic: {
                        topic: "Math",
                        name: "Algebra"
                    },
                    question: "if a=3 and b=4 what is a+b?",
                    answer: "7",
                    restricted: false
                }
            ]
        };
    };

    var questionsByTopicResponsePage1 = {
        count: 3,
        next: "https://dentest.com/questions/by_topic/Math/?format=json&page=2&page_size=1",
        previous: null,
        results: [
            {
                id: 1,
                subtopic: {
                    topic: "Math",
                    name: "Algebra"
                },
                question: "if a=3 and b=4 what is a+b?",
                answer: "7",
                restricted: false
            }
        ]
    };

    var questionsBySubtopicResponsePage1 = {
        count: 1,
        next: null,
        previous: null,
        results: [
            {
                id: 4,
                subtopic: {
                    topic: "Math",
                    name: "Calculus"
                },
                question: "Who invented Calculus",
                answer: "Newton and Leibniz came up with it at about the same time.",
                restricted: false
            }
        ]
    };


    //==================================TEST CODE==========================================

    beforeEach(module('questions'));
    beforeEach(module('globalConstants')); //Need REST URL for mocking responses

    var ctrl; //Controller to be tested
    var qService; //hook for jasmine spies
    var _$location_; //proxy for injected $location service
    var _$q_; //proxy for injected $q service
    var backend; //proxy for injected $httpBackend service
    var baseURL; //proxy for injected REST_BASE_URL constant

    //inject dependencies
    beforeEach(inject(function ($location, $q, $httpBackend, REST_BASE_URL) {
        _$location_ = $location;
        _$q_ = $q;
        backend = $httpBackend;
        baseURL = REST_BASE_URL;
    }));

    //inject QuestionService and set up spies
    beforeEach(inject(function (QuestionService) {
        QuestionService.set_page_size(1); //This would be set by routing, need this for tests
        spyOn(QuestionService, "getQuestions").and.callThrough();
        spyOn(QuestionService, "getQuestionsByTopic").and.callThrough();
        spyOn(QuestionService, "getQuestionsBySubtopic").and.callThrough();
        qService = QuestionService;

    }));

    //Convenience for adding query params to mocked requests
    var buildParams = function (page, page_size) {
        var params = {
            format: 'json',
            page: page,
            page_size: page_size,
        };

        var keys = Object.keys(params).sort(); //how angular orders query params
        var returnString = '?' + keys[0] + '=' + params[keys[0]] +
            '&' + keys[1] + '=' + params[keys[1]] + '&' + keys[2] + '=' + params[keys[2]];
        return returnString;
    };

    describe('Instantiation', function () {
        it('should start on page 1', inject(function ($controller) {
            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl = $controller('MainQuestionViewerCtrl');
            backend.flush();
            expect(ctrl.current_page_number()).toEqual(1);
        }));

        it('should start with the page size set to the default passed in', inject(function ($controller) {
            ctrl = $controller('MainQuestionViewerCtrl');
            expect(ctrl.page_size()).toEqual(1);
        }));

        it('should display all questions if not topic/subtopic was provided', inject(function ($controller) {
            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl = $controller('MainQuestionViewerCtrl');
            backend.flush();

            expect(ctrl.topic).toEqual('All');
            expect(ctrl.subtopic).toEqual('All');
            expect(ctrl.questions).toEqual(allQuestionsResponsePage1(baseURL).results);
            expect(qService.getQuestions).toHaveBeenCalledWith(1);

        }));

        it('should pull down all questions in a topic if only the topic was provided', inject(function ($controller) {
            backend.expectGET(baseURL + '/questions/by_topic/Math/' + buildParams(1, 1))
                .respond(200, questionsByTopicResponsePage1);
            ctrl = $controller('MainQuestionViewerCtrl', {$routeParams: {topic: 'Math'}});
            backend.flush();

            expect(ctrl.topic).toEqual('Math');
            expect(ctrl.subtopic).toEqual('All');
            expect(ctrl.questions).toEqual(questionsByTopicResponsePage1.results);
            expect(qService.getQuestionsByTopic).toHaveBeenCalledWith(1, 'Math');
        }));

        it('should pull down all questions in a subtopic if the topic/subtopic was provided', inject(function ($controller) {
            backend.expectGET(baseURL + '/questions/by_subtopic/Math/Calculus/' + buildParams(1, 1))
                .respond(200, questionsBySubtopicResponsePage1);
            ctrl = $controller('MainQuestionViewerCtrl', {$routeParams: {topic: 'Math', subtopic: 'Calculus'}});
            backend.flush();

            expect(ctrl.topic).toEqual('Math');
            expect(ctrl.subtopic).toEqual('Calculus');
            expect(ctrl.questions).toEqual(questionsBySubtopicResponsePage1.results);
            expect(qService.getQuestionsBySubtopic).toHaveBeenCalledWith(1, 'Math', 'Calculus');
        }));
    });


    describe('Pagination', function () {
        it('should store the total number of pages for the current results', inject(function ($controller) {
            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl = $controller('MainQuestionViewerCtrl');
            backend.flush();

            expect(ctrl.no_of_pages()).toEqual(4);
        }));


        it('should pull down the next page if next_page is called', inject(function ($controller) {
            //Mock a first request to set up pagination info
            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl = $controller('MainQuestionViewerCtrl');
            backend.flush();

            //clear the questions, as we are reusing the response
            ctrl.questions = [];
            expect(ctrl.questions).toEqual([]);

            backend.expectGET(baseURL + '/questions/' + buildParams(2, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl.next_page();
            backend.flush();
            expect(ctrl.questions).toEqual(allQuestionsResponsePage1(baseURL).results);
            expect(ctrl.current_page_number()).toEqual(2);
        }));

        it('should pull down the previous page if previous_page is called', inject(function ($controller) {
            //Mock a first request to set up pagination info
            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl = $controller('MainQuestionViewerCtrl');
            backend.flush();

            //move one page forward
            backend.expectGET(baseURL + '/questions/' + buildParams(2, 1)).respond(200, allQuestionsResponsePage2(baseURL));
            ctrl.next_page();
            backend.flush();

            //clear the questions, as we are reusing the response
            ctrl.questions = [];
            expect(ctrl.questions).toEqual([]);

            backend.expectGET(baseURL + '/questions/' + buildParams(1, 1)).respond(200, allQuestionsResponsePage1(baseURL));
            ctrl.previous_page();
            backend.flush();
            expect(ctrl.questions).toEqual(allQuestionsResponsePage1(baseURL).results);
            expect(ctrl.current_page_number()).toEqual(1);
        }));
    });

});
