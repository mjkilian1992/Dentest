angular.module('subscriptions').service('SubscriptionService',['$http','$q','REST_BASE_URL', function($http,$q,REST_BASE_URL){

    var self = this;

    self.token = null;
    self.is_subscribed = false;
    self.plan_info = {};

    var endpoints = {
        token_generation: REST_BASE_URL + '/generate_token/',
        plan_info: REST_BASE_URL + '/plan_info/',
        subscribe: REST_BASE_URL + '/subscribe/',
        cancel: REST_BASE_URL + '/cancel_subscription/',
        status: REST_BASE_URL + '/subscription_status/',
        change_payment: REST_BASE_URL + '/change_payment_method/'
    };

	self.init = function(){
        var deferred = $q.defer();
        if(self.token == null) {
            $http.get(endpoints.token_generation).then(
                function (response) {
                    self.token = response.data.token;
                },
                function (response) {
                    console.error("Could not generate braintree client token")
                }
            );
        }
        $http.get(endpoints.plan_info).then(
            function(response){
                self.plan_info = response.data;
            },
            function(response){

            }
        );
        $http.get(endpoints.status).then(
            function(response){
                if ( response.data.status=="Active"){
                    self.is_subscribed = true;
                }
            },
            function(response){}
        );
        deferred.resolve();
        return deferred.promise;
	};


    self.get_token = function(){
        return self.token;
    };

    self.subscribe = function(payment_method_nonce){
      var deferred = $q.defer();
        $http.post(endpoints.subscribe,{payment_method_nonce:payment_method_nonce}).then(
            function(response){
                deferred.resolve('Subscription Created!');
                self.init();
            },
            function(response){
                deferred.reject(response.data.errors);
            }
        );
        return deferred.promise;
    };

    self.cancel = function(){
        var deferred = $q.defer();
        $http.post(endpoints.cancel,{}).then(
            function(response){
                deferred.resolve('Subscription Cancelled!');
            },
            function(response){
                deferred.reject(response.data.errors);
            }
        );
        return deferred.promise;
    };

    self.status = function(){
        var deferred = $q.defer();
        $http.get(endpoints.status).then(
            function(response){
                if ( response.data.status=="Active"){
                    self.is_subscribed = true;
                }
                deferred.resolve(response.data);
            },
            function(response){
                deferred.reject(response.data.errors);
            }
        );
        return deferred.promise;
    };

    self.change_payment_method = function(payment_method_nonce){
        var deferred = $q.defer();
        $http.post(endpoints.change_payment,{payment_method_nonce:payment_method_nonce}).then(
            function(response){
                deferred.resolve("Payment changed successfully!");
            },
            function(response){
                deferred.reject(response.data.errors);
            }
        );
        return deferred.promise;
    };


}]);