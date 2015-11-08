angular.module('auth').controller('EmailConfirmationFormCtrl', ['$location', '$routeParams','Notification','RestfulAuthService',
 function ($location, $routeParams,Notification, RestfulAuthService) {
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
                Notification.success({
                    title: "Welcome " + confirm_details.username,
                    message:"You account has been confirmed successfully. Please log in to continue.",
                });
                $location.url('/');
            },
            function (response) {
                self.non_field_errors = response.non_field_errors || [];
            }
        );

    };
}]);