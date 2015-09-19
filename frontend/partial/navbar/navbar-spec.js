'use_strict';

describe('NavbarCtrl', function() {

	beforeEach(module('dentest'));

    //Hooks for API mocks
    var ctrl;
    var authService;

    //Mock out authService
    beforeEach(module(function($provide){
      $provide.service('RestfulAuthService',[function(){
            var self = this;

            //Start with attributes as if user is logged out
            self.logged_in = false;
            self.api_user = null;

            //mocked api methods
            self.user_profile = function(){return self.api_user;};
            self.is_logged_in = function(){return self.logged_in;};

            //fake login method for testing purposes (not part of RestfulAuthService API)
            self.login = function(username){
                self.logged_in=true;
                self.api_user = {username:username};
            };
        }]);
    }));

     //Set up spies
    beforeEach(inject(function(RestfulAuthService){
        spyOn(RestfulAuthService,'is_logged_in').andCallThrough();
        spyOn(RestfulAuthService,'user_profile').andCallThrough();
        authService = RestfulAuthService;
    }));

      //Instantiate controller
    beforeEach(inject(function($controller){
        ctrl = $controller('NavbarCtrl');
    }));

    it('should expose whether the user is logged in or not to the navbar',inject(function(RestfulAuthService){
        //user not logged in yet
        expect(ctrl.is_logged_in()).not.toBeTruthy();
        expect(ctrl.get_username()).toBeNull();
        expect(authService.is_logged_in).toHaveBeenCalled();
        expect(authService.user_profile).toHaveBeenCalled();

        //log user in
        authService.login('test');

        //Check user is now logged in
        expect(ctrl.is_logged_in()).toBeTruthy();
        expect(ctrl.get_username()).toEqual('test');
    }));
});