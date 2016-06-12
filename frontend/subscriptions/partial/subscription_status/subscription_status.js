angular.module('subscriptions').controller('SubscriptionStatusCtrl',['SubscriptionService',function(SubscriptionService){
    var self = this;

    self.user_subscribed = null;
    self.subscription_data = null;
    self.plan_info = SubscriptionService.plan_info;

    SubscriptionService.status().then(
        function(response){
            self.subscription_data = response;
            self.user_subscribed = true;
        },
        function(response){
            // no subscription found or problem encountered
            self.user_subscribed = false;
        }
    )

}]);