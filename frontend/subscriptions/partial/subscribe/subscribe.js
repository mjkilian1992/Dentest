angular.module('subscriptions').controller('SubscribeCtrl',['SubscriptionService',function(SubscriptionService){
    var self = this;

    self.plan_info = SubscriptionService.plan_info;
}]);
