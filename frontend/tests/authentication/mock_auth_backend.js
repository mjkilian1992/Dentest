'use_strict';
/**
Defines a mocked out version of the Restful Auth API. URLs have been defined to match those on the Django server
=
*/

var backend = angular.module('BackendMock');

backend.factory('RestfulAuthMock',['$httpBackend','BackendMock.BASE_URL',function($httpBackend,rootUrl){
    var mock = $httpBackend;
    
    //Test Data
    var bronze_user = {
        username:'testBronze',
        email:'test.bronze@fake.com',
        first_name:'Joe',
        last_name:'Bloggs', 
        token: '1234567890qwertyuiop';
    };
    bronze_password = 'zZ123##<>';
    
    var silver_user = {
        username:'testSilver',
        email:'test.silver@fake.com',
        first_name:'Jane',
        last_name:'Doe',
        token: 'zxcvbnmasdfghjklqwertyuiop';
    };
    silver_password = 'gh708++H2';
    
    //Correct login of Bronze User
    mock.when('POST',rootUrl+'/login/',{
        password:bronze_password,
        username:bronze_user.username
        }
     )
    .respond(bronze_user);
    
     //Correct login of Silver User
    mock.when('POST',rootUrl+'/login/',{
        password:silver_password,
        username:silver_user.username
        }
     )
    .respond(silver_user);'
    
    return mock;
    
   
}]);
