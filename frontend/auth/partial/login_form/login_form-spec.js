'use_strict';
/**
Controller for logging in.
 */

describe('LoginFormCtrl', function() {

    var ctrl; //Controller to be tested
    var service; //hook for jasmine spies
    var _$location_; //proxy for inject $location service
    var _$rootScope_; //proxy for inject $rootScope

    beforeEach(module('auth'));

    //Mock out AuthService
    beforeEach(module(function ($provide) {
        $provide.service('RestfulAuthService',['$q',function ($q) {
            var self = this;
            self.login = function (username, password) {
                var deferred = $q.defer();
                if (username === 'test1' && password === 'password1') {
                    deferred.resolve();
                } else {
                    deferred.reject({non_field_errors: ['non_field_error_1']});
                }
                return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function(RestfulAuthService){
        spyOn(RestfulAuthService,'login').and.callThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function($controller){
        ctrl = $controller('LoginFormCtrl');
    }));

    //Inject dependencies
    beforeEach(inject(function($location,$rootScope){
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //initialise any global state
    beforeEach(function(){
        _$location_.path('/login'); //pretend we start at login page
    });

    //Clean Up
    afterEach(function(){
        ctrl = null;
    });

	it('should log the user in if they provide the correct details and redirect to the home page', function(){
        ctrl.login_details = {
            username:'test1',
            password:'password1',
        };
        ctrl.login();
        _$rootScope_.$apply(); //needed to make promises resolve correctly

        expect(service.login).toHaveBeenCalledWith('test1','password1');

        expect(_$location_.url()).toEqual('/');
    });

    it('should store an error message to display if the login failed',function(){
        ctrl.login_details = {
            username:'test1',
            password:'wrongPassword',
        };
        ctrl.login();
        _$rootScope_.$apply(); //needed to make promises resolve correctly

        expect(service.login).toHaveBeenCalledWith('test1','wrongPassword');
        expect(ctrl.non_field_errors).toEqual(['non_field_error_1']);

        //Route should not change on failure
        expect(_$location_.url()).toEqual('/login');
    });


});