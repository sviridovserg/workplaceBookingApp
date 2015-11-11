angular.module('designerWorkplaceApp').factory('dataService', ['$http', '$q','appConfig', function ($http, $q, appConfig) {
    'use strict';

    function get(urlMethod, data, convertCallback, failMessage) {
        var defer = $q.defer();
        $http.post(appConfig.serviceUrl + urlMethod, data)
            .then(function (response) {
                if (response.data.IsError) {
                    defer.reject(response.data.Data.ErrorMessage);
                    return;
                }
                convertCallback ? defer.resolve(convertCallback(response.data.Data)) : defer.resolve();
            },
            function () {
                defer.reject(failMessage);
            });
        return defer.promise;
    }

    function getList(urlMethod, data, convertItemCallback, failMessage) {
        var defer = $q.defer();
        $http.post(appConfig.serviceUrl + urlMethod, data)
            .then(function (response) {
                if (response.data.IsError) {
                    defer.reject(response.data.Data.ErrorMessage);
                    return;
                }
                var result = [];
                _.each(response.data.Data, function (item) {
                    result.push(convertItemCallback(item));
                });
                defer.resolve(result);
            },
            function () {
                defer.reject(failMessage);
            });
        return defer.promise;
    }

    return {
        get: get,
        getList: getList
    };
}]);