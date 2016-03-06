'use_strict';

describe('RestfulAuthService',function(){
    beforeEach(module('auth'));
    beforeEach(module('globalConstants'));

    //Test Data
    var bronze_user = {
        username:'testBronze',
        email:'test.bronze@fake.com',
        first_name:'Joe',
        last_name:'Bloggs',
    };

    var bronze_password = 'zZ123##<>';
    var bronze_token = '1234567890qwertyuiop';
    var bronze_login_response = jQuery.extend(true,{token:bronze_token},bronze_user); //add token (not in user profile)
    var bronze_reg_details = jQuery.extend(true,{password1:'AsDf1234{}',password2:'AsDf1234{}'},bronze_user); //add passwords


    var authservice,mockBackend,baseURL;

    //Defines an errors list and callback function as we would expect a controller to have
    var errors = null;
    var error_handler = function(response){
        errors = response;
    };

    beforeEach(inject(function($httpBackend,RestfulAuthService,REST_BASE_URL){
        baseURL = REST_BASE_URL;
        errors = null;
        mockBackend = $httpBackend;
        spyOn(RestfulAuthService,'login').and.callThrough();
        spyOn(RestfulAuthService,'logout').and.callThrough();
        authservice = RestfulAuthService;
    }));

    afterEach(function(){
        mockBackend.verifyNoOutstandingExpectation();
        mockBackend.verifyNoOutstandingRequest();
        authservice.logout(); //just clears all persistent state
    });

    //========================================LOGIN======================================================================
    describe('Logging in',function(){

        it('should make a request to the correct api endpoint',function(){
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(200,{});
            authservice.login('test','test');
            mockBackend.flush();
        });

        it("should store the users details and set the Authorization header with the token if they have the correct credentials",inject(function($http){
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(200,bronze_login_response);
            authservice.login('testBronze','zZ123##<>');
            mockBackend.flush();
            expect(authservice.is_logged_in()).toBe(true);
            expect(authservice.user_profile()).toEqual(bronze_user);
            //expectation works because the header is set on the REAL http service
            expect($http.defaults.headers.common['Authorization']).toEqual('Token ' + bronze_token);
        }));

        it("should return a list of errors if the credentials were incorrect",function(){
            var serializer_errors = {'non_field_errors':'Unable to login with credentials provided'};
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(401,serializer_errors);
            authservice.login('testBronze','gibberish').catch(error_handler);
            mockBackend.flush();
            expect(authservice.is_logged_in()).toBe(false);
            expect(errors).toEqual(serializer_errors);
        });
    });

     //====================================LOGOUT===========================================================================
    describe('Logging out',function(){

        it("should clear the users profile if they are logged in (relies on login working)",inject(function($http){
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(200,bronze_login_response);
            authservice.login('testBronze','zZ123##<>').then(error_handler,error_handler);
            mockBackend.flush();
            //Check preconditions
            expect(authservice.user_profile()).toEqual(bronze_user);
            expect($http.defaults.headers.common['Authorization']).toEqual('Token ' + bronze_token);
            //Now check logout clears info
            authservice.logout();
            expect(authservice.is_logged_in()).toBe(false);
            expect(authservice.user_profile()).toEqual({username:null,email:null,first_name:null,last_name:null});
            expect($http.defaults.headers.common['Authorization']).toEqual(null);
        }));

    });

     //=================================REGISTRATION==========================================================================
    describe('Registration',function(){

        it("should make a request to the correct api endpoint",function(){
            mockBackend.expectPOST(baseURL + '/register/?format=json').respond(400,{}); //cause an error so login is not called
            authservice.register(bronze_reg_details).catch(null);
            mockBackend.flush();
        });

        it("should resolve if successful",function(){
            mockBackend.expectPOST(baseURL + '/register/?format=json').respond(201,{});
            authservice.register(bronze_reg_details);
            mockBackend.flush();
        });

        it("should return errors if invalid details were provided",function(){
            mockBackend.expectPOST(baseURL + '/register/?format=json').respond(400,{'errors':[]});
            authservice.register(bronze_reg_details).catch(error_handler);
            mockBackend.flush();
            expect(authservice.login).not.toHaveBeenCalled();
            expect(errors).toEqual({'errors':[]});
        });
    });

    //==================================PASSWORD RESET========================================================================
    describe('Password Reset',function(){
        it("should make a request to the correct api endpoint",function(){
            mockBackend.expectPOST(baseURL + '/password_reset/?format=json').respond(201,{});
            authservice.password_reset({username:bronze_user.username});
            mockBackend.flush();
        });

        it("should return error if invalid details were provided",function(){
            mockBackend.expectPOST(baseURL + '/password_reset/?format=json').respond(401,{'errors':[]});
            authservice.password_reset({username:bronze_user.username}).catch(error_handler);
            mockBackend.flush();
            expect(errors).toEqual({'errors':[]});
        });
    });

    //==================================PASSWORD RESET CONFIRM================================================================
    describe('Password Reset Confirm',function(){

        var reset_info = {
            username:'testBronze',
            key:'1234567890',
            password1:'1337:@H4XX0Rz',
            password2:'1337:@H4XX0Rz',
        };

        it('should make a request to the correct api endpoint',function(){
            mockBackend.expectPOST(baseURL + '/password_reset_confirm/?format=json').respond(400,{}); //fake error to avoid login
            authservice.password_reset_confirm(reset_info);
            mockBackend.flush();
        });

        it("should log the user in if successful (relies on login)",function(){
            mockBackend.expectPOST(baseURL + '/password_reset_confirm/?format=json').respond(200,{});
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(200,bronze_login_response);
            authservice.password_reset_confirm(reset_info);
            mockBackend.flush();
            expect(authservice.login).toHaveBeenCalledWith('testBronze','1337:@H4XX0Rz');
            expect(authservice.user_profile()).toEqual(bronze_user);
        });

        it('should return errors if invalid details were provided',function(){
            mockBackend.expectPOST(baseURL + '/password_reset_confirm/?format=json').respond(400,{'errors':[]});
            authservice.password_reset_confirm(reset_info).catch(error_handler);
            mockBackend.flush();
            expect(errors).toEqual({'errors':[]});
        });

        it('should return the login error if login fails the reset for some reason',function(){
            mockBackend.expectPOST(baseURL + '/password_reset_confirm/?format=json').respond(200,{});
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(500,{'errors':[]});
            authservice.password_reset_confirm(reset_info).catch(error_handler);
            mockBackend.flush();
            expect(authservice.login).toHaveBeenCalledWith('testBronze','1337:@H4XX0Rz');
            expect(errors).toEqual({'errors':[]});
        });
    });

     //===================================EMAIL ACTIVATION======================================================================
     describe('Email Activation',function(){

        var reset_info = {
            username:'testBronze',
            key:'1234567890',
        };

        it('should make a request to the correct api endpoint',function(){
            mockBackend.expectPOST(baseURL + '/confirm_email/?format=json').respond(200,{});
            authservice.confirm_email(reset_info);
            mockBackend.flush();
        });

        it('should return errors if invalid details were provided',function(){
            mockBackend.expectPOST(baseURL + '/confirm_email/?format=json').respond(400,{'errors':[]});
            authservice.confirm_email(reset_info).catch(error_handler);
            mockBackend.flush();
            expect(errors).toEqual({'errors':[]});
        });

    });

     //==========================================PROFILE UPDATE=================================================================
    describe('Profile Update',function(){
        it('should make a request to the correct api endpoint',function(){
            mockBackend.expectPUT(baseURL + '/update_profile/?format=json').respond(200,{});
            authservice.update_profile({});
            mockBackend.flush();
        });

        it('should return errors if invalid details were provided or username was included',function(){
            mockBackend.expectPUT(baseURL + '/update_profile/?format=json').respond(400,{'errors':[]});
            authservice.update_profile(bronze_user).catch(error_handler);
            mockBackend.flush();
            expect(errors).toEqual({'errors':[]});
        });

        it("should change the service's api_user as required",function(){
            mockBackend.expectPUT(baseURL + '/update_profile/?format=json').respond(200,{});
            authservice.update_profile({});
            mockBackend.flush();
        })

    });

    //=========================================USER COOKIE==============================================================
    describe('User Cookie',function(){
        it("should be created at login",inject(function($cookies){
            mockBackend.expectPOST(baseURL + '/login/?format=json').respond(200,bronze_login_response);
            authservice.login('testBronze','zZ123##<>');
            mockBackend.flush();
            expect(authservice.is_logged_in()).toBe(true);
            expect(authservice.user_profile()).toEqual(bronze_user);
            expect($cookies.getObject('dentest_user')).toEqual(bronze_user);
            expect($cookies.getObject('dentest_token')).toEqual(bronze_token);
        }));

        it("should be destroyed on logout",inject(function($cookies){
            $cookies.putObject('dentest_user',{username:"test"});
            $cookies.putObject('dentest_token',"sklgasdgaodf13r2etawerqedgserwrstwgergwhbrgnfpj");
            authservice.logout();
            expect($cookies.getObject('dentest_user')).toEqual(undefined);
            expect($cookies.getObject('dentest_token')).toEqual(undefined);
        }));
    });
});