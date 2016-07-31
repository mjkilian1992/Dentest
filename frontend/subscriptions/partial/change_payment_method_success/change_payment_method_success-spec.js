describe('ChangePaymentMethodSuccessCtrl', function() {

	beforeEach(module('subscriptions'));

	var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('ChangePaymentMethodSuccessCtrl', {$scope: scope});
    }));	

	it('should ...', inject(function() {

		expect(1).toEqual(1);
		
	}));

});