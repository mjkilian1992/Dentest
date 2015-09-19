angular.module('auth').controller('LoginFormCtrl',['$location','RestfulAuthService', function($location,RestfulAuthService) {
    var self = this;

    self.non_field_errors = [];

    self.login = function(){
        RestfulAuthService.login(self.login_details.username,self.login_details.password)
            .then(function(){
                $location.path('/');
            },function(response){
                self.non_field_errors = response.non_field_errors || [];
            });
    };

}]);