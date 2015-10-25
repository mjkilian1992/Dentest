describe('SubtopicViewCtrl', function () {

    //============================================== TEST DATA==========================================================
    var subtopic1 = {
        topic: "Math",
        name: "Algebra",
        description: "That thing where letters represent numbers."
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
        spyOn(QuestionService, "getSubtopic").and.callThrough();
        qService = QuestionService;
    }));

    describe('Instantiation', function () {
        it("Should fetch and display the subtopic if found on the backend", inject(function ($controller) {
            backend.expectGET(baseURL + '/subtopic/Math/Algebra/?format=json').respond(200, subtopic1);
            ctrl = $controller('SubtopicViewCtrl', {$routeParams: {topic_name: 'Math', subtopic_name: 'Algebra'}});
            backend.flush();

            expect(ctrl.subtopic).toEqual(subtopic1);
            expect(ctrl.subtopic_not_found).toBeFalsy();

        }));

        it("Should set an error flag if the topic could not be found", inject(function ($controller) {
            backend.expectGET(baseURL + '/subtopic/Math/Algebra/?format=json').respond(404, {detail: 'Not found.'});
            ctrl = $controller('SubtopicViewCtrl', {$routeParams: {topic_name: 'Math', subtopic_name: 'Algebra'}});
            backend.flush();

            expect(ctrl.subtopic).toEqual({});
            expect(ctrl.subtopic_not_found).toBeTruthy();

        }));
    });
});