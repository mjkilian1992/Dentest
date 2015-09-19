angular.module('auth').controller('UpdateProfileFormCtrl',['$location','RestfulAuthService',function($location,RestfulAuthService){
    var self = this;

    //Instantiate fields with saved values for user
    self.user_details = RestfulAuthService.user_profile();
    self.edit_mode = false;

    self.username_errors = [];
    self.email_errors = [];
    self.first_name_errors = [];
    self.last_name_errors = [];
    self.non_field_errors = [];

    self.update_profile = function(){
        RestfulAuthService.update_profile(self.user_details).then(
            function(){
                self.user_details = RestfulAuthService.user_profile(); //Update form fields
                alert('Details updated successfully!');
                self.edit_mode=false;
            },
            function(response){
                self.username_errors = response.username || [];
                self.email_errors = response.email || [];
                self.first_name_errors = response.first_name || [];
                self.last_name_errors = response.last_name || [];
                self.non_field_errors = response.non_field_errors || [];
            }
        );
    };

    self.allow_editing = function(){
        self.edit_mode = true;
    }


}]);


