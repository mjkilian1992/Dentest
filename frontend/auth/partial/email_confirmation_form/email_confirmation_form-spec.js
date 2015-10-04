describe('EmailConfirmationFormCtrl',function() {

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
            self.confirm_email = function (confirm_email_details) {
                var deferred = $q.defer();
                if (confirm_email_details.username === 'test1' && confirm_email_details.key === '123456789') {
                    deferred.resolve();
                } else {
                    deferred.reject({non_field_errors: ['non_field_error1']});
                }
                return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function (RestfulAuthService) {
        spyOn(RestfulAuthService, 'confirm_email').and.callThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function ($controller) {
        ctrl = $controller('EmailConfirmationFormCtrl', {$routeParams: routeParams});
    }));

    //Inject dependencies
    beforeEach(inject(function ($location, $rootScope) {
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //Clean Up
    afterEach(function () {
        ctrl = null;
        routeParams = {};
    });

    it('should confirm the users email and log them in if a correct (username,key) pair are provided', function () {
        //set location to include valid username and token
        _$location_.url('/email_confirmation/test1/123456789');
        routeParams.username = 'test1';
        routeParams.key = '123456789';

        ctrl.confirm_email();
        _$rootScope_.$apply(); //Force promises to be return

        expect(service.confirm_email).toHaveBeenCalled();
        expect(ctrl.non_field_errors).toEqual([]);
        expect(_$location_.url()).toEqual('/'); //user should be logged in
    });

    it('should fail if the (username,key) pair is not valid', function () {
        _$location_.url('/confirm_email/test/sddf');
        routeParams.username = 'test';
        routeParams.token = 'sddf';

        ctrl.confirm_email();
        _$rootScope_.$apply();

        expect(ctrl.non_field_errors).toEqual(['non_field_error1']);
        expect(_$location_.url()).toEqual('/confirm_email/test/sddf');
    });

});