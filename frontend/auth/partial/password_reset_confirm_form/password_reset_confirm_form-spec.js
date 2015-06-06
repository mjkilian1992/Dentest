describe('PasswordResetConfirmFormCtrl', function() {

	var ctrl; //Controller to be tested
    var service; //hook for jasmine spies
    var _$location_; //proxy for injected $location service
    var _$rootScope_; //proxy for injected $rootScope
    var routeParams = {}; //place to configure route parameters for tests

    beforeEach(module('auth'));

    //Mock out AuthService
    beforeEach(module(function ($provide) {
        $provide.service('RestfulAuthService',['$q',function ($q) {
            var self = this;
            var password_re = /[A-Za-z0-9]{8,128}/;
            self.password_reset_confirm = function(reset_confirm_details){
                var deferred = $q.defer();
                var clause1 = reset_confirm_details.username == 'test1';
                var clause2 = reset_confirm_details.token == '123456789';
                var clause3 = reset_confirm_details.password1 == reset_confirm_details.password2;
                var clause4 = password_re.test(reset_confirm_details.password1);
                var clause5 = password_re.test(reset_confirm_details.password2);

                //success
                if(clause1 && clause2 && clause3 && clause4 && clause5){
                    deferred.resolve();
                    return deferred.promise;
                }
                var errors = {};
                if(!clause1 || !clause2 || clause3){
                    errors.non_field_errors = ['non_field_error1'];
                }
                if(!clause4){
                    errors.password1 = ['Passwords must contain at least 8 characters and must be alphanumeric.'];
                }
                if(!clause5){
                    errors.password2 = ['Passwords must contain at least 8 characters and must be alphanumeric.'];
                }
                deferred.reject(errors);
                return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function(RestfulAuthService){
        spyOn(RestfulAuthService,'password_reset_confirm').andCallThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function($controller){
        ctrl = $controller('PasswordResetConfirmFormCtrl',{$routeParams:routeParams});
    }));

    //Inject dependencies
    beforeEach(inject(function($location,$rootScope,$routeParams){
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //Clean Up
    afterEach(function(){
        ctrl = null;
        routeParams = {};
    });

    it('should reset the users password, log them in and redirect to the home page if successful',function(){
        //set location to include valid username and token
        _$location_.url('/password_reset_confirm/test1/123456789');
        routeParams.username = 'test1';
        routeParams.token = '123456789';

        ctrl.reset_confirm_details = {
            password1: 'Password123',
            password2: 'Password123',
        };
        ctrl.password_reset_confirm();
        _$rootScope_.$apply(); //Force promises to be return

        expect(ctrl.password1_errors).toEqual([]);
        expect(ctrl.password2_errors).toEqual([]);
        expect(ctrl.non_field_errors).toEqual([]);
        expect(_$location_.url()).toEqual('/'); //user should be logged in

    });

    it('should report all errors encountered if the confirm fails',function(){
        _$location_.url('/password_reset_confirm/test/sddf');
        routeParams.username = 'test';
        routeParams.token = 'sddf';

        ctrl.reset_confirm_details = {
            password1: '',
            password2: 'wrong',
        };

        ctrl.password_reset_confirm();
        _$rootScope_.$apply();

        expect(ctrl.password1_errors).toEqual(['Passwords must contain at least 8 characters and must be alphanumeric.']);
        expect(ctrl.password2_errors).toEqual(['Passwords must contain at least 8 characters and must be alphanumeric.']);
        expect(ctrl.non_field_errors).toEqual(['non_field_error1']);
        expect(_$location_.url()).toEqual('/password_reset_confirm/test/sddf');
    })
});