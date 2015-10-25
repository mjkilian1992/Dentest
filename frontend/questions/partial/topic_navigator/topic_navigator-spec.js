describe('TopicNavigatorCtrl', function() {
    var subtopics_response = {
        "count": 3,
        "next": null,
        "previous": null,
        "results": [
            {
                "topic": "Math",
                "name": "Algebra",
                "description": "That thing where letters represent numbers."
            },
            {
                "topic": "Math",
                "name": "Calculus",
                "description": "For calculating gradients, etc."
            },
            {
                "topic": "Physics",
                "name": "Quantum",
                "description": "If you think you understand quantum theory..."
            }
        ]
    };


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
        spyOn(QuestionService, "getSubtopics").and.callThrough();
        qService = QuestionService;
        qService.set_page_size(1000000); //mimics setting of page size in routing
    }));

    describe("Instantiation", function(){
        it("should pull down the list of all subtopics to work with from the backend",inject(function($controller){
            backend.expectGET(baseURL + '/subtopics/?format=json&page=1&page_size=1000000').respond(200, subtopics_response);
            ctrl = $controller('TopicNavigatorCtrl');
            backend.flush();
            expect(qService.getSubtopics).toHaveBeenCalledWith(1);
            expect(ctrl.error).toBeFalsy();
        }));

        it("should build these into a hierarchical structure with topics under subtopics",inject(function($controller){
            backend.expectGET(baseURL + '/subtopics/?format=json&page=1&page_size=1000000').respond(200, subtopics_response);
            ctrl = $controller('TopicNavigatorCtrl');
            backend.flush();
			expect(qService.getSubtopics).toHaveBeenCalledWith(1);
            expect(ctrl.topic_list).toEqual([
                {topic:'Math',subtopics:['Algebra','Calculus']},
                {topic:'Physics',subtopics:['Quantum']},
            ]);
            expect(ctrl.error).toBeFalsy();
        }));

        it("should report an error if the subtopics could not be fetched for some reason",inject(function($controller){
            backend.expectGET(baseURL + '/subtopics/?format=json&page=1&page_size=1000000').respond(404, {});
            ctrl = $controller('TopicNavigatorCtrl');
            backend.flush();
			expect(qService.getSubtopics).toHaveBeenCalledWith(1);
            expect(ctrl.error).toBeTruthy();
        }));
    });
});