angular.module('dentest').controller('NavbarCtrl',['$location','RestfulAuthService',function($location,RestfulAuthService){
    var self = this;

    //Wrap auth service methods to check if user is logged in
    self.is_logged_in = RestfulAuthService.is_logged_in;
    self.get_username = function(){
        var api_user = RestfulAuthService.user_profile();
        if(api_user != null){
            console.log('FETCH ON NAVBAR: ' + api_user['username']);
            return api_user['username'];
        }else{
            return null;
        }
    };

    self.logout = function(){
        RestfulAuthService.logout();
        $location.path('/');
    }


}]);