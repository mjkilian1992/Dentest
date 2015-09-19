describe('PasswordResetFormCtrl', function() {

	beforeEach(module('auth'));

	var ctrl; //Controller to be tested
    var service; //hook for jasmine spies
    var _$location_; //proxy for inject $location service
    var _$rootScope_; //proxy for inject $rootScope

    beforeEach(module('auth'));

    //Mock out AuthService
    beforeEach(module(function ($provide) {
        $provide.service('RestfulAuthService',['$q',function ($q) {
            var self = this;
            self.password_reset = function (reset_details) {
                var deferred = $q.defer();
                var clause1 = reset_details.username === 'test1';
				var clause2 = reset_details.email === 'thisisvalid@madeup.com';
				var clause3 = reset_details.first_name === 'test';
				var clause4 = reset_details.last_name === 'data';
				if(clause1 && clause2 && clause3 & clause4){
					deferred.resolve();
				}else{
					deferred.reject({non_field_errors:['non_field_error1','non_field_error2']});
				}
				return deferred.promise;
            };
        }]);
    }));

    //Set up spies
    beforeEach(inject(function(RestfulAuthService){
        spyOn(RestfulAuthService,'password_reset').andCallThrough();
        service = RestfulAuthService;
    }));

    //Instantiate controller
    beforeEach(inject(function($controller){
        ctrl = $controller('PasswordResetFormCtrl');
    }));

    //Inject dependencies
    beforeEach(inject(function($location,$rootScope){
        _$location_ = $location;
        _$rootScope_ = $rootScope;
    }));

    //initialise any global state
    beforeEach(function(){
        _$location_.path('/password_reset'); //pretend we start at login page
    });

    //Clean Up
    afterEach(function(){
        ctrl = null;
    });

    it('should reset the users password and redirect to a page confirming the reset request',function(){
       ctrl.reset_details = {
           username:'test1',
           email:'thisisvalid@madeup.com',
           first_name:'test',
           last_name:'data',
       };
        ctrl.password_reset();
        _$rootScope_.$apply();

        expect(ctrl.non_field_errors).toEqual([]);
        expect(_$location_.url()).toEqual('/password_reset_request_success');
    });

    it('should return a non_field_error if the details were wrong',function(){
        ctrl.reset_details = {
            username:'wrongName',
            email:'thisISNOTValid@madeup.com',
            first_name:'test',
            last_name:'data',
        };
        ctrl.password_reset();
        _$rootScope_.$apply();

        expect(ctrl.non_field_errors).toEqual(['non_field_error1','non_field_error2']);
        expect(_$location_.url()).toEqual('/password_reset');
    });
});