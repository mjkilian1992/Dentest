angular.module('auth').controller('EmailConfirmationFormCtrl', ['$location', '$routeParams','RestfulAuthService', function ($location, $routeParams, RestfulAuthService) {
    var self = this;

    //errors
    self.non_field_errors = [];

    self.confirm_email = function () {
        var confirm_details = {
            username: $routeParams.username,
            key: $routeParams.key,
        };
        RestfulAuthService.confirm_email(confirm_details).then(
            function () {
                $location.url('/');
            },
            function (response) {
                self.non_field_errors = response.non_field_errors || [];
            }
        );

    };
}]);