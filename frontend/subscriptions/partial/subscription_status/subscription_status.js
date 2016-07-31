angular.module('subscriptions').controller('SubscriptionStatusCtrl',['SubscriptionService',function(SubscriptionService){
    var self = this;

    self.user_subscribed = null;
    self.subscription_data = null;
    self.plan_info = SubscriptionService.plan_info;
    self.panel_scheme = 'panel panel-primary'

    SubscriptionService.status().then(
        function(response){
            self.subscription_data = response;
            self.user_subscribed = true;
            var status = self.subscription_data.status;
            if(status == 'Active'){
                self.panel_scheme = 'panel panel-success'
            }else if(status == 'Pending'){
                self.panel_scheme = 'panel panel-warning'
            }else if(status == 'Canceled'){
                self.panel_scheme = 'panel panel-danger'
            }
        },
        function(response){
            // no subscription found or problem encountered
            self.user_subscribed = false;
        }
    )

}]);