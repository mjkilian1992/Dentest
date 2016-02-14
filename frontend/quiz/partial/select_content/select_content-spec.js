describe('SelectContentCtrl', function() {

    //==================== TEST DATA====================/
    var subtopicResponse = {
            count: 5,
            next: null,
            previous: null,
            results: [
                {
                    topic: "Math",
                    name: "Algebra",
                    description: "That thing where letters represent numbers."
                },
                {
                    topic: "Math",
                    name: "Calculus",
                    description: "Derivatives and stuff"
                },
                {
                    topic: "Physics",
                    name: "Thermodynamics",
                    description: "In this house we obey the second law of thermodynamics!"
                },
                {
                    topic: "Physics",
                    name: "Quantum",
                    description: "If you think you understand quantum theory, you don't understand quantum theory"
                },
                {
                    topic: "Pseudoscience",
                    name: "Homeopathy",
                    description: "Water"
                }
            ]
        };

    beforeEach(module('questions'));
    beforeEach(module('quiz'));
    beforeEach(module('globalConstants'));

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
        spyOn(QuestionService, "getSubtopics").and.callThrough();
        spyOn(QuestionService, "structureSubtopicsHierarchically").and.callThrough();
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
        it('should pull subtopics for QuestionService and set all subtopics as unselected', inject(function ($controller) {
            backend.expectGET(baseURL + '/subtopics/' + buildParams(1, qService.get_page_size())).respond(200, subtopicResponse);
            ctrl = $controller('SelectContentCtrl');
            backend.flush();

            //Check service used correctly
            expect(qService.getSubtopics).toHaveBeenCalled();
            expect(qService.structureSubtopicsHierarchically).toHaveBeenCalled();

            //Now check structure is correct;
            for(var i = 0; i < ctrl.topic_list.length; i++){
                expect(ctrl.topic_list[i].include).toBeFalsy();
                for(var j = 0; j < ctrl.topic_list[i].subtopics.length; j++){
                    expect(ctrl.topic_list[i].subtopics[j].include).toBeFalsy();
                }
            }
        }));
    });

    describe('Selection',function(){
        it('should select all Subtopics belonging to a Topic when that Topic is selected',inject(function($controller){
            backend.expectGET(baseURL + '/subtopics/' + buildParams(1, qService.get_page_size())).respond(200, subtopicResponse);
            ctrl = $controller('SelectContentCtrl');
            backend.flush();

            //Check all topics are initially unselected
            for(var i = 0; i < ctrl.topic_list.length; i++){
                expect(ctrl.topic_list[i].include).toBeFalsy();
                for(var j = 0; j < ctrl.topic_list[i].subtopics.length; j++){
                    expect(ctrl.topic_list[i].subtopics[j].include).toBeFalsy();
                }
            }

            //Now select a topic

            for(var i =0; i < ctrl.topic_list.length; i++){
                if(ctrl.topic_list[i].topic==="Physics"){
                    ctrl.topic_list[i].include = true; //mimic select of Topic
                    ctrl.selectSubtopicsOfTopic("Physics");
                    for(var j =0; j < ctrl.topic_list[i].subtopics.length; j++){
                        expect(ctrl.topic_list[i].subtopics[j].include).toBeTruthy();
                    }
                }
            }
        }));
    })

});