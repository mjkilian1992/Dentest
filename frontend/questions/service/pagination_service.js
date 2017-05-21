/**Service which handles pagination. The service doesnt care what REST endpoints it is paging through,
 * it works by storing next and previous page links and moving between them. The pages are returned to
 * be handled by the relelvant service/controller as appropriate.
 *
 */
angular.module('questions').service('PaginationService',['$q', '$http',function($q, $http){
    var self = this;

    //====================PAGINATION CONFIG AND STATE=============================
    var page_size = 50; //Can replace this with clever method later

    var pagination_info = {
        no_of_items: 0,
        no_of_pages: null,
        current_page_number: null,
        next_page_number: null,
        previous_page_number: null,
        next_page_link: null,
        previous_page_link: null,
    };

    /**====================PAGINATION METHODS===================================*/

    self.get_page_size = function () {
        return page_size;
    };

    self.set_page_size = function (size) {
        page_size = size;
    };

    self.get_pagination_info = function () {
        return pagination_info;
    };

    self.clear_pagination_info = function () {
        pagination_info.no_of_items = 0;
        pagination_info.no_of_pages = null;
        pagination_info.current_page_number = null;
        pagination_info.next_page_number = null;
        pagination_info.next_page_link = null;
        pagination_info.previous_page_number = null;
        pagination_info.previous_page_link = null;
    };

    self.build_pagination_info = function (request_page_number, response) {
        pagination_info.no_of_items = response.count;
        pagination_info.next_page_link = response.next;
        pagination_info.previous_page_link = response.previous;
        pagination_info.current_page_number = request_page_number;
        if (response.next == null) {
            pagination_info.next_page_number = null;
        } else {
            pagination_info.next_page_number = request_page_number + 1;
        }
        if (response.previous == null) {
            pagination_info.previous_page_number = null;
        } else {
            pagination_info.previous_page_number = request_page_number - 1;
        }
        pagination_info.no_of_pages = Math.ceil(Number(response.count) / page_size);
    };

    self.next_page = function () {
        var deferred = $q.defer();
        if (pagination_info.next_page_number == null) {
            deferred.reject({errors: ['There is no a next page.']});
        } else {
            $http.get(pagination_info.next_page_link)
                .then(function (response) { //success
                    self.build_pagination_info(pagination_info.current_page_number + 1, response.data);
                    deferred.resolve(response.data.results);
                }, function (response) { //failure
                    deferred.reject(response.data);
                });
        }
        return deferred.promise;
    };

    self.previous_page = function () {
        var deferred = $q.defer();
        if (pagination_info.previous_page_number == null) {
            deferred.reject({errors: ['There is no previous page.']});
        } else {
            $http.get(pagination_info.previous_page_link)
                .then(function (response) { //success
                    self.build_pagination_info(pagination_info.current_page_number - 1, response.data);
                    deferred.resolve(response.data.results);
                }, function (response) { //failure
                    deferred.reject(response.data);
                });
        }
        return deferred.promise;
    };

}]);