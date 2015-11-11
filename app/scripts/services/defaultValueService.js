angular.module('designerWorkplaceApp').factory('defaultValueService', ['$localStorage', function ($localStorage) {
    'use strict';
    function getDefaultValues(key) {
        if (!$localStorage[key]) {
            return {};
        }
        return $localStorage[key];
    }

    function setDefaultValues(key, values) {
        $localStorage[key] = values;
    }

    return {
        get: getDefaultValues,
        set: setDefaultValues
    };
}]);