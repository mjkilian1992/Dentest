'use_strict';

describe('RestfulAuthService',function(){
    beforeEach(module('dentest'));
    
     //Test Data
    var bronze_user = {
        username:'testBronze',
        email:'test.bronze@fake.com',
        first_name:'Joe',
        last_name:'Bloggs', 
        token: '1234567890qwertyuiop';
    };
    bronze_password = 'zZ123##<>';
    
    var silver_user = {
        username:'testSilver',
        email:'test.silver@fake.com',
        first_name:'Jane',
        last_name:'Doe',
        token: 'zxcvbnmasdfghjklqwertyuiop';
    
    var authservice,mockBackend,baseURL;
    beforeEach(inject(function($httpBackendRestfulAuthService,REST_BASE_URL){
        baseURL = REST_BASE_URL
        mockBackend = $httpBackend;
        spyOn(RestfulAuthService,'login').andCallThrough();
        spyOn(RestfulAuthService,'logout').andCallThrough();
        authservice = RestfulAuthService;
    }));

    describe('Logging in',function(){
        it('should make a request to the correct api endpoint',function(){
            mockBackend.expectPOST(baseURL + '/login/');
            authservice.login('test','test');
            mockBackend.flush();
        });
        it("should store the users details and set the Authorization header with the token if they have the correct credentials",function(){
            mockBackend.expectPOST(baseURL + '/login/').respond(200,bronze_user);
            authservice.login('testBronze','zZ123##<>');
            mockBackend.flush();
            expect(authservice.user_profile()).toEqual(bronze_user);
        });
    });
});
