describe('TopicViewCtrl', function () {

    //============================================== TEST DATA==========================================================
    var topic1 = {
        name: "Math",
        description: "Numbers and stuff"
    };

    //============================================= TEST SETUP==========================================================
    beforeEach(module('questions'));
    beforeEach(module('globalConstants'));

    var _$q_; //mock for promises
    var qService; //hook for jasmin spies
    var ctrl; //controller under test
    var backend; //proxy for injected mock $http
    var baseURL; //REST Base URL (to be injected from global config)

    //inject dependencies
    beforeEach(inject(function ($q, $httpBackend, REST_BASE_URL) {
        _$q_ = $q;
        backend = $httpBackend;
        baseURL = REST_BASE_URL;
    }));

    //inject QuestionService and set up spies
    beforeEach(inject(function (QuestionService) {
        spyOn(QuestionService, "getTopic").and.callThrough();
        qService = QuestionService;
    }));

    describe('Instantiation', function () {
        it("Should fetch and display the topic if found on the backend", inject(function ($controller) {
            backend.expectGET(baseURL + '/topic/Math/?format=json').respond(200, topic1);
            ctrl = $controller('TopicViewCtrl', {$routeParams: {topic_name: 'Math'}});
            backend.flush();

            expect(ctrl.topic).toEqual(topic1);
            expect(ctrl.topic_not_found).toBeFalsy();

        }));

        it("Should set an error flag if the topic could not be found", inject(function ($controller) {
            backend.expectGET(baseURL + '/topic/Math/?format=json').respond(404, {'detail': 'Not found'});
            ctrl = $controller('TopicViewCtrl', {$routeParams: {topic_name: 'Math'}});
            backend.flush();

            expect(ctrl.topic).toEqual({});
            expect(ctrl.topic_not_found).toBeTruthy();

        }));
    });
});