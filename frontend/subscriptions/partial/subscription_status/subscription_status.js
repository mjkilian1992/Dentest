angular.module('subscriptions').controller('SubscriptionStatusCtrl',['SubscriptionService',function(SubscriptionService){
    var self = this;

    self.user_subscribed = null;
    self.subscription_data = null;
    self.plan_info = SubscriptionService.plan_info;

    SubscriptionService.status().then(
        function(response){
                self.user_subscribed = !('user_not_subscribed' in response);
                console.log("USER SUBSCRIBED: " + self.user_subscribed);
                self.subscription_data = response;
        },
        function(response){
            // no subscription found or problem encountered
            self.user_subscribed = false;
            self.subscription_data = null;
        }
    )

}]);