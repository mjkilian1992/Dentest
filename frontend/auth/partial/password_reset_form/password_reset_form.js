angular.module('auth').controller('PasswordResetFormCtrl',['$location','RestfulAuthService',function($location,RestfulAuthService){
    var self = this;

    self.non_field_errors = [];

    self.password_reset = function(){
        RestfulAuthService.password_reset(self.reset_details).then(
            function(){
                $location.url('/password_reset_request_success');
            },
            function(response){
                self.non_field_errors = response.non_field_errors || [];
            }
        );
    };

}]);