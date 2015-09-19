describe('RegistrationFormCtrl', function () {

    var ctrl;
    var service; //hook for jasmine spies
    var _$location_; //proxy for injected $location service
    var _$rootScope_; //proxy for inject $rootScope

    beforeEach(module('auth'));

    //Mock out AuthService
    beforeEach(module(function ($provide) {
        $provide.service('RestfulAuthService', ['$q', function ($q){
            var self = this;
            self.register = function(registration_details) {
                var deferred = $q.defer();

                var username_re = /[A-Za-z0-9_]{1,30}/;
                var password_re = /[A-Za-z0-9]{8,128}/;

                var errors = {};
                if (!username_re.test(registration_details.username)) {
                    errors.username = ['This is not a valid username.'];
                }
                if (!password_re.test(registration_details.password1)) {
                    errors.password1 = ['Passwords must contain at least 8 characters and must be alphanumeric.'];
                }
                if (registration_details.password1 !== registration_details.password2) {
                    errors.non_field_errors = ['Passwords entered do not match.'];
                }
                //If errors object is empty, we have succeeded
                if (Object.getOwnPropertyNames(errors).length === 0) {
                    deferred.resolve();
                } else {
                    deferred.reject(errors);
                }
                return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function(RestfulAuthService) {
        spyOn(RestfulAuthService, 'register').andCallThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function($controller) {
        ctrl = $controller('RegistrationFormCtrl');
    }));

    //inject service dependencies
    beforeEach(inject(function($location,$rootScope){
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //initialise any global state
    beforeEach(function(){
        _$location_.path('/signup'); //pretend we start at signup page
    });

    //Clean Up
    afterEach(function () {
        ctrl = null;
    });

    it('should register a user if all their details are valid, sign them in and redirect to the home page',function(){
       ctrl.registration_details = {
           username: 'mjk1992',
           password1: 'Password123',
           password2: 'Password123',
           email: 'thisisvalid@madeup.com',
           first_name:'test',
           last_name:'data',
       };
       ctrl.register();
        _$rootScope_.$apply(); //needed to make promises resolve correctly

        expect(service.register).toHaveBeenCalled();
        expect(ctrl.non_field_errors).toEqual([]);
        expect(ctrl.username_errors).toEqual([]);
        expect(ctrl.password1_errors).toEqual([]);
        expect(ctrl.password2_errors).toEqual([]);
        expect(ctrl.first_name_errors).toEqual([]);
        expect(ctrl.last_name_errors).toEqual([]);

        expect(_$location_.url()).toEqual('/signup_success');
    });

    it('should store errors correctly if the details are incorrect',function(){
       ctrl.registration_details = {
           username: '[]',
           password1:'{}',
           password2:'',
           email:'anythingyoulike',
           first_name:'Bob',
           last_name:'Ajob',
       };
        ctrl.register();
        _$rootScope_.$apply(); //needed to make promises resolve correctly

        expect(service.register).toHaveBeenCalled();
        expect(ctrl.non_field_errors).toEqual(['Passwords entered do not match.']);
        expect(ctrl.username_errors).toEqual(['This is not a valid username.']);
        expect(ctrl.password1_errors).toEqual(['Passwords must contain at least 8 characters and must be alphanumeric.']);
        expect(ctrl.password2_errors).toEqual([]); //didnt set errors on password 2 in mock service
        expect(ctrl.first_name_errors).toEqual([]);
        expect(ctrl.last_name_errors).toEqual([]);

        //route should not have changed
        expect(_$location_.url()).toEqual('/signup');
    });


});