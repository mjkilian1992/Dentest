'use_strict';

angular.module('auth').service('RestfulAuthService', ['$cookies','$http','$q', 'REST_BASE_URL', function ($cookies,$http, $q, base_url) {
    var self = this;

    //define backend urls
    var api_urls = {
        login: base_url + '/login/',
        registration: base_url + '/register/',
        password_reset: base_url + '/password_reset/',
        password_reset_confirm: base_url + '/password_reset_confirm/',
        confirm_email: base_url + '/confirm_email/',
        update_profile: base_url + '/update_profile/',
    };
    //hold user credentials to be accessed
    var api_user = {
        username: null,
        email: null,
        first_name: null,
        last_name: null,
    };
    var api_user_token = null;

    //flag to show the user is logged in
    var logged_in = false;
    self.is_logged_in = function () {
        return logged_in;
    };

    self.user_profile = function () {
        return api_user;
    };

    //Common values and methods
    var query_params = {params: {format: 'json'}};

    //grab cookie info if its there
    if($cookies.get('dentest_user')){
        api_user = $cookies.getObject('dentest_user');
        logged_in = true;
    }

    //===================================API METHODS===========================================================
    //===================================LOGIN=======================================
    self.login = function (username, password) {
        //Log a user in.
        //Will return an empty object if no errors occurs, otherwise a set of error messages
        var deferred = $q.defer();
        $http.post(api_urls.login, {username: username, password: password}, query_params)
            .then(function (response) { //success
                //extract data
                api_user.username = response.data.username;
                api_user.email = response.data.email;
                api_user.first_name = response.data.first_name;
                api_user.last_name = response.data.last_name;
                api_user_token = response.data.token;
                //Add auth token to headers for all future requests
                $http.defaults.headers.common['Authorization'] = "Token " + api_user_token;
                logged_in = true;

                //Set cookies
                $cookies.putObject('dentest_user',api_user);

                deferred.resolve(response.data);
            },function(response){
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //===================================LOGOUT=======================================
    self.logout = function () {
        api_user.username = null;
        api_user.email = null;
        api_user.first_name = null;
        api_user.last_name = null;
        api_user_token = null;
        $http.defaults.headers.common['Authorization'] = null;
        logged_in = false;
        $cookies.remove('dentest_user');
    };

    //==================================REGISTRATION===================================
    self.register = function (user_details) {
        //Register a user. The user details should contain a username,email,password1 and password2,
        //first_name and last_name.
        var deferred = $q.defer();
        $http.post(api_urls.registration, user_details, query_params)
            .then(function (response) { //success
                deferred.resolve('User registered successfully.');
            },function(response){
                //may have been stripped out depending on whether login or register failed
                var result = response.data || response;
                deferred.reject(result);
            });
        return deferred.promise;
    };

    //==================================PASSWORD RESET==================================
    self.password_reset = function (reset_details) {
        //Make a password reset request. Requires the full set of user details (username,email,first_name,last_name)
        var deferred = $q.defer();
        $http.post(api_urls.password_reset, reset_details, query_params)
            .then(function (response) { //success
                //if the user was logged in when they did this, they now need to be logged out
                self.logout();
                deferred.resolve(response.data);
            },function(response){
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //===================================PASSWORD RESET CONFIRM===========================
    self.password_reset_confirm = function (reset_confirm_details) {
        //Confirm a password reset. Requres a username, key and matching password pair (password1 and password2)
        var deferred = $q.defer();
        $http.post(api_urls.password_reset_confirm, reset_confirm_details, query_params)
            .then(function (response) { //success
                //if this succeeds log the user in with their new password
                return self.login(reset_confirm_details.username, reset_confirm_details.password1);
            }).then(function(response){
                deferred.resolve(response); //login will have stripped out data already
            },function(response){
                //may have been stripped out depending on wheter login or reset failed
                var result = response.data || response;
                deferred.reject(result);
            });
        return deferred.promise;
    };

    //=================================CONFIRM EMAIL======================================
    self.confirm_email = function (email_confirm_details) {
        //Confirm an email address. Requires a username and key
        var deferred = $q.defer();
        $http.post(api_urls.confirm_email, email_confirm_details, query_params)
            .then(function(response){
                deferred.resolve(response.data);
            },function(response){
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

    //==================================UPDATE PROFILE====================================
    self.update_profile = function (user_details) {
        //Update a user's info. Will require their email to be reconfirmed.
        var deferred = $q.defer();
        $http.put(api_urls.update_profile, user_details, query_params)
            .then(function (response) { //success
                //will need to log the user out
                self.logout();
                deferred.resolve(response.data);
            },function(response) {
                deferred.reject(response.data);
            });
        return deferred.promise;
    };

}]);