angular.module('subscriptions').controller('CancelCtrl', ['$location', '$uibModal','Notification', 'SubscriptionService', function ($location,$uibModal, Notification, SubscriptionService) {
    var self = this;
    var modal = null;

    self.open = function () {
        modal = $uibModal.open({
            animation: true,
            controller:'CancelModalInstanceCtrl as modalCtrl',
            templateUrl: 'cancel_modal.html',
            size: 200
        });
    };

}]);

angular.module('subscriptions').controller('CancelModalInstanceCtrl',['$location', '$uibModalInstance','Notification', 'SubscriptionService', function ($location,$uibModalInstance, Notification, SubscriptionService) {
    var self = this;
    self.errors = [];

    self.cancel = function () {
        SubscriptionService.cancel().then(
            function () {
                $uibModalInstance.close();
                Notification.success({
                    title: "Subscription cancelled",
                    message: "Your subscription to Dentest has been cancelled successfully"
                });
                SubscriptionService.init();
                $location.path('/');
            },
            function (response) {
                 Notification.error({
                    title: "Could not cancel subscriptions!",
                    message: "Something went wrong cancelling your subscription. Please see our help page."
                });
            }
        )
    };

    self.close = function(){
        $uibModalInstance.close('');
    }

}]);