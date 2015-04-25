'use_strict';

/**Main module for the Dentest app. Configure all routes and top level constants here*/
var app = angular.module('dentest',[
    'ngRoute',
    'dentest.auth',
]);

app.constant('REST_BASE_URL','https://dentest.com')
