angular.module('auth').controller('LoginFormCtrl',['$location','Notification','RestfulAuthService', function($location,Notification,RestfulAuthService) {
    var self = this;

    self.non_field_errors = [];

    self.login = function(){
        RestfulAuthService.login(self.login_details.username,self.login_details.password)
            .then(function(){
                Notification.success({
                    message:"Welcome " + self.login_details.username + "!",
                    title: "Logged in successfully",
                 });
                 $location.path('/');
            },function(response){
                self.non_field_errors = response.non_field_errors || [];
            });
    };

}]);