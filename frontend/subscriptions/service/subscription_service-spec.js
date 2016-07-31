describe('SubscriptionService', function () {

    beforeEach(module('globalConstants'));
    beforeEach(module('subscriptions'));

    var backend, SubService, baseURL;

    beforeEach(inject(function ($httpBackend, SubscriptionService, REST_BASE_URL) {
        backend = $httpBackend;
        SubService = SubscriptionService;
        baseURL = REST_BASE_URL;

        // Initialise state
        backend.expectGET(REST_BASE_URL + '/generate_token/').respond(200, {
            token: 'asfdLDSDFDS'
        });
        backend.expectGET(REST_BASE_URL + '/plan_info/').respond(200, {
            billing_frequency: 365,
            price: 30
        });
        backend.expectGET(REST_BASE_URL + '/subscription_status/').respond(404, {});
        SubService.init();
        backend.flush();

    }));

    afterEach(function () {
        backend.verifyNoOutstandingExpectation();
        backend.verifyNoOutstandingRequest();
    });

    describe('Creating a subscription', function () {

        it('Should take a payment method nonce and send it to the correct endpoint. It should then update the user status', function () {
            backend.expectPOST(baseURL + '/subscribe/').respond(200, {});
            backend.expectGET(REST_BASE_URL + '/plan_info/').respond(200, {
                billing_frequency: 365,
                price: 30
            });
            backend.expectGET(REST_BASE_URL + '/subscription_status/').respond(404, {});
            SubService.subscribe("123456");
            backend.flush();
        });

        it('Should return and unpack errors if something went wrong', function () {
            backend.expectPOST(baseURL + '/subscribe/').respond(500, {errors: ['error1', 'error2']});
            var response;
            SubService.subscribe("123456").catch(function (errors) {
                response = errors;
            });
            backend.flush();
            expect(response).toEqual(['error1', 'error2']);


        });

    });


    describe('Cancelling a subscription', function () {
        it('Should make a request to the correct endpoint', function () {
            backend.expectPOST(baseURL + '/cancel_subscription/').respond(200, {});
            SubService.cancel();
            backend.flush();
        });

        it('Should return and unpack errors if something went wrong', function () {
            backend.expectPOST(baseURL + '/cancel_subscription/').respond(500, {errors: ['error1', 'error2']});
            var response;
            SubService.cancel().catch(function (errors) {
                response = errors;
            });
            backend.flush();
            expect(response).toEqual(['error1', 'error2']);
        });
    });

    describe('Viewing subscription status', function () {
        it('Should retrieve the users subscriptions status if available from the correct endpoint', function () {
            backend.expectGET(baseURL + '/subscription_status/').respond(200, {
                status: "status"
            });
            var response;
            SubService.status().then(function (r) {
                response = r;
            });
            backend.flush();
            expect(response).toEqual({status: "status"});
        });

        it('Should return and unpack errors if something went wrong', function () {
            backend.expectGET(baseURL + '/subscription_status/').respond(500, {errors: ['error1', 'error2']});
            var response;
            SubService.status().catch(function (errors) {
                response = errors;
            });
            backend.flush();
            expect(response).toEqual(['error1', 'error2']);
        });
    });

    describe('Changing payment method', function () {
        it('Should accept a payment method nonce and push it to the backend', function () {
            backend.expectPOST(baseURL + '/change_payment_method/').respond(200, {});
            SubService.change_payment_method("123456");
            backend.flush();
        });

        it('Should return and unpack errors if something went wrong', function () {
            backend.expectPOST(baseURL + '/change_payment_method/').respond(500, {errors: ['error1', 'error2']});
            var response;
            SubService.change_payment_method("123456").catch(function (errors) {
                response = errors;
            });
            backend.flush();
            expect(response).toEqual(['error1', 'error2']);
        });
    });


});