angular.module('auth').controller('PasswordResetConfirmFormCtrl',['$location','$routeParams','RestfulAuthService',function($location,$routeParams,RestfulAuthService){
    var self = this;

    self.password1_errors = [];
    self.password2_errors = [];
    self.non_field_errors = [];

    self.password_reset_confirm = function(){
        //Username and token should be parsed out of URL by $routeProvider
        self.reset_confirm_details.username = $routeParams.username;
        self.reset_confirm_details.key = $routeParams.key;
        console.log(self.reset_confirm_details);
        RestfulAuthService.password_reset_confirm(self.reset_confirm_details).then(
            function(){
                $location.url('/');
            },
            function(response){
                self.password1_errors = response.password1 || [];
                self.password2_errors = response.password2 || [];
                self.non_field_errors = response.non_field_errors || [];
            }
        );
    };
}]);