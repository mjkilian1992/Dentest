describe('QuestionByIdViewCtrl', function() {

    //============================================== TEST DATA==========================================================
    var question1 = {
        id: 1,
        subtopic: {
            topic: "Math",
            name: "Algebra"
        },
        question: "if a=3 and b=4 what is a+b?",
        answer: "7",
        restricted: false
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
        spyOn(QuestionService, "getQuestionByID").and.callThrough();
        qService = QuestionService;
    }));

    describe('Instantiation',function(){

        it('should fetch a question using a question ID provide through route parameters',inject(function($controller){
            backend.expectGET(baseURL + '/questions/question_number/1/?format=json').respond(200,question1);
            ctrl = $controller('QuestionByIdViewCtrl',{$routeParams:{number:1}});
            backend.flush();

            expect(ctrl.question).toEqual(question1);
            expect(ctrl.question_not_found).toBeFalsy();
            expect(ctrl.question_restricted).toBeFalsy();

        }));

        it('should display an error if the question number doesnt exist',inject(function($controller){
            backend.expectGET(baseURL + '/questions/question_number/400/?format=json').respond(404,{detail:'Not found.'});
            ctrl = $controller('QuestionByIdViewCtrl',{$routeParams:{number:400}});
            backend.flush();

            expect(ctrl.question).toEqual(null);
            expect(ctrl.question_not_found).toBeTruthy();
            expect(ctrl.question_restricted).toBeFalsy();
        }));

        it('should display an error if the particular question is restricted',inject(function($controller){
            backend.expectGET(baseURL + '/questions/question_number/2/?format=json').respond(403,{detail:'Permission denied.'});
            ctrl = $controller('QuestionByIdViewCtrl',{$routeParams:{number:2}});
            backend.flush();

            expect(ctrl.question).toEqual(null);
            expect(ctrl.question_not_found).toBeFalsy();
            expect(ctrl.question_restricted).toBeTruthy();
        }));
    });

});

