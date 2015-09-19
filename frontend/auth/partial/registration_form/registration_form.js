angular.module('auth').controller('RegistrationFormCtrl',['$location','RestfulAuthService',function($location,RestfulAuthService){
    var self = this;

    //Field Errors
    self.username_errors = [];
    self.email_errors = [];
    self.password1_errors = [];
    self.password2_errors = [];
    self.first_name_errors = [];
    self.last_name_errors = [];

    //non_field_errors: should come up primarily if passwords given dont match
    self.non_field_errors = [];

    self.register = function(){
        RestfulAuthService.register(self.registration_details).then(
            function(){
                $location.path('/registration_success');
            },
            function(response){
                self.username_errors = response.username || [];
                self.email_errors = response.email || [];
                self.password1_errors = response.password1 || [];
                self.password2_errors = response.password2 || [];
                self.first_name_errors = response.first_name || [];
                self.last_name_errors = response.last_name || [];
                self.non_field_errors = response.non_field_errors || [];
            }
        );

    };

}]);