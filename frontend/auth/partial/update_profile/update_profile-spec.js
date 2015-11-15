describe('UpdateProfileCtrl', function () {

    var ctrl; //Controller to be tested
    var service; //hook for jasmine spies
    var _$location_; //proxy for injected $location service
    var _$rootScope_; //proxy for injected $rootScope
    var routeParams = {}; //place to configure route parameters for tests

    beforeEach(module('auth'));

    //Mock out AuthService
    beforeEach(module(function ($provide) {
        $provide.service('RestfulAuthService', ['$q', function ($q) {
            var self = this;
            var api_user = {
                username: 'test1',
                email: 'thisisvalid@madeup.com',
                first_name: 'Test',
                last_name: 'Data',
            };

            self.user_profile = function(){
                return api_user;
            };

            self.update_profile = function (profile_details) {
                var deferred = $q.defer();
                var username_re = /[A-Za-z0-9_]{1,30}/;
                var clause1 = username_re.test(profile_details.username);
                var clause2 = profile_details.email.length > 0;
                var clause3 = profile_details.first_name.length > 0;
                var clause4 = profile_details.last_name.length > 0;

                var errors = {};
                if (clause1 && clause2 && clause3 && clause4) {
                    api_user = profile_details;
                    deferred.resolve();
                } else {
                    if (!clause1) {
                        errors.username = ['This is not a valid username.'];
                    }
                    if (!clause2) {
                        errors.email = ['This is not a valid email.'];
                    }
                    if (!clause3) {
                        errors.first_name = ['This is not a valid first name.'];
                    }
                    if (!clause4) {
                        errors.last_name = ['This is not a valid last name.'];
                    }
                    deferred.reject(errors);
                }
                return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function (RestfulAuthService) {
        spyOn(RestfulAuthService, 'update_profile').and.callThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function ($controller) {
        ctrl = $controller('UpdateProfileFormCtrl', {$routeParams: routeParams});
    }));

    //Inject dependencies
    beforeEach(inject(function ($location, $rootScope) {
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //Instantiate global state
    beforeEach(function () {
        _$location_.url('/update_profile');
    });

    //Clean Up
    afterEach(function () {
        ctrl = null;
        routeParams = {};
    });

    it('should instantiate the form field with the users stored details', function () {
        expect(ctrl.user_details.username).toEqual('test1');
        expect(ctrl.user_details.email).toEqual('thisisvalid@madeup.com');
        expect(ctrl.user_details.first_name).toEqual('Test');
        expect(ctrl.user_details.last_name).toEqual('Data');
    });

    it('should update the users profile if the details provided are valid', function () {
        ctrl.user_details = {
            username: 'test2',
            email: 'newemail@madeup.com',
            first_name: 'MyOtherName',
            last_name: 'IsThis',
        };

        ctrl.update_profile();
        _$rootScope_.$apply(); //Force promises to be return

        expect(service.update_profile).toHaveBeenCalled();

        expect(ctrl.user_details).toEqual({
            username: 'test2',
            email: 'newemail@madeup.com',
            first_name: 'MyOtherName',
            last_name: 'IsThis',
        });

        expect(ctrl.email_errors).toEqual([]);
        expect(ctrl.first_name_errors).toEqual([]);
        expect(ctrl.last_name_errors).toEqual([]);
        expect(ctrl.non_field_errors).toEqual([]);
        expect(_$location_.url()).toEqual('/update_profile'); //location shouldnt change
    });

    it('should make errors available if the details provided are invalid', function () {
        ctrl.user_details = {
            username: '{}',
            email: 'thisisvalid@madeup.com',
            first_name: '',
            last_name: '',
        };

        ctrl.update_profile();
        _$rootScope_.$apply(); //Force promises to be return

        expect(service.update_profile).toHaveBeenCalled();
        expect(ctrl.email_errors).toEqual([]);
        expect(ctrl.first_name_errors).toEqual(['This is not a valid first name.']);
        expect(ctrl.last_name_errors).toEqual(['This is not a valid last name.']);
        expect(ctrl.non_field_errors).toEqual([]);
        expect(_$location_.url()).toEqual('/update_profile'); //location shouldnt change

    });
});