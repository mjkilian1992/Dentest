'use-strict';

var backend = angular.module('BackendMock',
    [
        'BackendMock.RestfulAuthMock',
    ]
);

backend.constant('BackendMock.BASE_URL','https://dentest.com');
