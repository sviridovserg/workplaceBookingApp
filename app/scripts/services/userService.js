angular.module('designerWorkplaceApp').factory('userService', ['$cookies', '$q', 'dataService', function ($cookies, $q, dataService) {
    'use strict';
    var currentUser = null;

    function createUser(data) {
        return {
            name: data.FormattedName,
            id: data.Id,
            jobPositionId: data.JobPositionId,
            servData_: data
        };
    }

    function login(userName, password) {
        return dataService.get('/DesignerWorkplace/AuthenticateUser', { 'Login': userName, 'Password': password }, createUser, 'Произошла ошибка при входе в систему')
            .then(function (user) {
                currentUser = user;
                return currentUser;
            });
    }

    function logout() {
        return dataService.get('/DesignerWorkplace/LogOut', null, null, 'Произошла ошибка при выходе из системы')
            .then(function () { currentUser = null; });
    }

    function changePassword(email) {
        return dataService.get('/DesignerWorkplace/ResetPassword', { Email: email },
            function (data) { return data.Message; }, 'Произошла ошибка при смене пароля');
    }

    function getUnusedWorkHours(user, year, month) {
        return dataService.get('/DesignerWorkplace/GetDesignerFreeWorkHours',
            {
                Year: year,
                Month: month,
                DesignerId: user.jobPositionId
            }, function (data) { return data.Text; }, 'Произошла ошибка при получении нераспределенных часов дизайнера');
    }

    function checkLogin() {
        var userId = $cookies.get('UserId');
        if (!userId) {
            return $q.resolve(null);
        }
        return dataService.get('/DesignerWorkplace/GetUser', { 'Id': userId }, createUser, 'Произошла ошибка при проверке доступа в систему')
            .then(function (user) {
                currentUser = user;
                return currentUser;
            });
    }

    return {
        login: login,
        logout: logout,
        changePassword: changePassword,
        getUnusedWorkHours: getUnusedWorkHours,
        isLoggedIn: checkLogin,
        getCurrentUser: function () {
            return currentUser;
        }
    };
}]);