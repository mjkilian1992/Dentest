describe('TopicSelectionService', function() {

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
    beforeEach(module('globalConstants'));

    var qService; //hook for jasmine spies
    var selectionService;
    var _$q_; //proxy for injected $q service
    var backend; //proxy for injected $httpBackend service
    var baseURL; //proxy for injected REST_BASE_URL constant

    //inject dependencies
    beforeEach(inject(function ($q, $httpBackend, REST_BASE_URL) {
        _$q_ = $q;
        backend = $httpBackend;
        baseURL = REST_BASE_URL;
    }));

    //inject QuestionService and set up spies
    beforeEach(inject(function (QuestionService) {
        spyOn(QuestionService, "getAllSubtopics").and.callThrough();
        spyOn(QuestionService,"structureSubtopicsHierarchically").and.callThrough();
        qService = QuestionService;

    }));

    //inject TopicSelectionService and set up spies
    beforeEach(inject(function(TopicSelectionService){
        selectionService = TopicSelectionService;
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

    describe('Fetching Clean Topic List', function () {
        it('should pull subtopics from server via QuestionService and set all subtopics as unselected',function() {
            backend.expectGET(baseURL + '/subtopics/' + buildParams(1, 1000000)).respond(200, subtopicResponse);
            selectionService.getCleanTopicList();
            backend.flush();

            expect(qService.getAllSubtopics).toHaveBeenCalled();
            expect(qService.structureSubtopicsHierarchically).toHaveBeenCalled();

            var topicListRef = selectionService.topic_list;
            //Now check structure is correct;
            for(var i = 0; i < topicListRef.length; i++){
                expect(topicListRef[i].include).toBeFalsy();
                for(var j = 0; j < topicListRef[i].subtopics.length; j++){
                    expect(topicListRef[i].subtopics[j].include).toBeFalsy();
                }
            }
        });
    });

    describe('Selection',function(){
        it('should select all subtopics of a provided topic when asked',function(){
            backend.expectGET(baseURL + '/subtopics/' + buildParams(1, 1000000)).respond(200, subtopicResponse);
            selectionService.getCleanTopicList();
            backend.flush();

            expect(qService.getAllSubtopics).toHaveBeenCalled();
            expect(qService.structureSubtopicsHierarchically).toHaveBeenCalled();

            //Check all topics are initially unselected
            for(var i = 0; i < selectionService.topic_list.length; i++){
                expect(selectionService.topic_list[i].include).toBeFalsy();
                for(var j = 0; j < selectionService.topic_list[i].subtopics.length; j++){
                    expect(selectionService.topic_list[i].subtopics[j].include).toBeFalsy();
                }
            }

            //Now select a topic

            for(var l  =0; l < selectionService.topic_list.length; l++){
                if(selectionService.topic_list[l].topic==="Physics"){
                    selectionService.topic_list[l].include = true; //mimic select of Topic
                    selectionService.selectSubtopicsOfTopic("Physics");
                    for(var m =0; m < selectionService.topic_list[l].subtopics.length; m++){
                        expect(selectionService.topic_list[l].subtopics[m].include).toBeTruthy();
                    }
                }
            }
        });
    });
});