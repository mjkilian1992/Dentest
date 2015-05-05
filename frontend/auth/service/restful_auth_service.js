angular.module('auth').service('RestfulAuthService',['$http','REST_BASE_URL',function($http,base_url){
    var self = this;
    
    //define backend urls
    var api_urls = {
        login: base_url+'/login/',
        registration: base_url+'/register/',
        password_reset: base_url+'/password_reset/',
        password_reset_confirm: base_url+'/password_reset_confirm/',
        confirm_email: base_url+'/confirm_email/',
        update_profile: base_url+'/update_profile/',
    }
    //hold user credentials to be accessed 
    var api_user = {
        username:null,
        email:null,
        first_name:null,
        last_name:null,
    }
    var api_user_token = null;
    
    //flag to show the user is logged in
    var logged_in = false;
    self.is_logged_in = function(){
        return logged_in;
    };
    
    self.user_profile = function(){
        return api_user;
    };
   
    var query_params = {params:{format:'json'}};
    
    //===================================API METHODS===========================================================
    //===================================LOGIN=======================================
    self.login = function(username,password,error_handler){
        //Log a user in. error_handler is a callback function which handles any errors returned.
        //Will return an empty object if no errors occurs, otherwise a set of error messages
        $http.post(api_urls.login,{username:username,password:password},query_params)
        .then(function(response){ //success
            //extract data
            api_user.username = response.data.username;
            api_user.email = response.data.email;
            api_user.first_name = response.data.first_name;
            api_user.last_name = response.data.last_name;
            api_user_token = response.data.token;
            //Add auth token to headers for all future requests
            $http.defaults.headers.common['Authorization'] =  api_user_token;
            logged_in = true;
            error_handler({});
        },function(response){ //error
            error_handler(response.data); //return serializer errors
        });
    };
    
    //===================================LOGOUT=======================================
    self.logout = function(){
        api_user.username = null;
        api_user.email = null;
        api_user.first_name = null;
        api_user.last_name = null;
        api_user_token = null;
        $http.defaults.headers.common['Authorization'] = null;
        logged_in = false;
    };
    
    //==================================REGISTRATION===================================
    self.register = function(user_details,error_handler){
        //Register a user. The user details should contain a username,email,password1 and password2, first_name and last_name.
        //error handler is a callback function which handles any errors returned.
        //If successful, an empty object is returned to the error_handler. Otherwise it will be populated with errors.
        $http.post(api_urls.registration,user_details,query_params)
        .then(function(response){ //success
            //Log the new user in
            self.login(user_details.username,user_details.password1,error_handler);
            error_handler({});    
        },function(response){ //error
            error_handler(response.data);
        });
    };
    
    //==================================PASSWORD RESET==================================
    self.password_reset = function(reset_details,error_handler){
        //Make a password reset request. Requires the full set of user details (username,email,first_name,last_name)
        //error handler is a callback function which handles any errors returned.
        //If successful, an empty object is returned to the error_handler. Otherwise it will be populated with errors.
        $http.post(api_urls.password_reset,reset_details,query_params)
        .then(function(response){ //success
            //if the user was logged in when they did this, they now need to be logged out
            self.logout();
            error_handler({});
         },function(response){ //error
            error_handler(response.data);
         });
    };
    
    //===================================PASSWORD RESET CONFIRM===========================
    self.password_reset_confirm = function(reset_confirm_details,error_handler){
        //Confirm a password reset. Requres a username, key and matching password pair (password1 and password2)
        //error handler is a callback function which handles any errors returned.
        //If successful, an empty object is returned to the error_handler. Otherwise it will be populated with errors.
        $http.post(api_urls.password_reset_confirm, reset_confirm_details,query_params)
        .then(function(response){ //success
            //if this succeeds log the user in with their new password
            self.login(reset_confirm_details.username,reset_confirm_details.password1,error_handler);
            error_handler({});
         },function(response){ //error
            error_handler(response.data);
         });
     };
     
     //=================================CONFIRM EMAIL======================================
     self.confirm_email = function(email_confirm_details,error_handler){
        //Confirm an email address. Requres a usernameand key.
        //error handler is a callback function which handles any errors returned.
        //If successful, an empty object is returned to the error_handler. Otherwise it will be populated with errors.
        $http.post(api_urls.confirm_email,email_confirm_details,query_params)
        .then(function(response){ //success
            error_handler({});
         },function(response){ //error
            error_handler(response.data);
         });
     }
     
     //==================================UPDATE PROFILE====================================
     self.update_profile = function(user_details,error_handler){
        //Update a user's info. Will require their email to be reconfirmed.
        //error handler is a callback function which handles any errors returned.
        //If successful, an empty object is returned to the error_handler. Otherwise it will be populated with errors.
        $http.put(api_urls.update_profile,user_details,query_params)
        .then(function(response){ //success
            //will need to log the user out
            self.logout();
            error_handler({});
         },function(response){ //error
            error_handler(response.data);
         });
     };
   
}]);
