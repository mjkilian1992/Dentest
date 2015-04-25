'use_strict'

var authModule = angular.module('dentest.auth');
authModule.service('RestfulAuthService',['$http','$httpProvider','REST_BASE_URL',function($http,$httpProvider,base_url){
    var self = this;
    
    //define backend urls
    var api_urls = {
        login: base_url+'/login/',
    }
    //hold user credentials to be accessed 
    var api_user = {
        username:null,
        email:null,
        first_name:null,
        last_name:null,
    }
    var api_user_token = null
    
    self.user_profile = function(){
        return api_user;
    }
    self.login = function(username,password){
        $http.post(api_urls.login,{username:username,password:password})
        .then(function(response){ //success
            //extract data
            api_user.username = response.data.username;
            api_user.email = response.data.email;
            api_user.first_name = response.data.first_name;
            api_user.last_name = response.data.last_name;
            api_user_token = response.data.token;
            //Add auth token to headers for all future requests
            $httpProvider.defaults.headers.common['Authorization'] =  api_user_token;
            return True
        },function(response){ //error
            return response.data; //return serializer errors
        });
    });
    
    self.logout = function(){
        api_user.username = null;
        api_user.email = null;
        api_user.first_name = null;
        api_user.last_name = null;
        api_user_token = null;
        $httpProvider.defaults.headers.common['Authorization'] = null;
   };
   
}]);
        
