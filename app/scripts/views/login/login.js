'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:loginCtrl
 * @description
 * # loginCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('loginCtrl', ['$scope', '$state', 'userService', 'notificationService', function ($scope, $state, userService, notificationService) {
      $scope.user = {
          name: '',
          password: ''
      };
      $scope.isLoading = false;
      $scope.processLogin = function () {
          $scope.isLoading = true;
          userService.login($scope.user.name, $scope.user.password).then(function () {
              $state.transitionTo('designer.bookingCalendar');
              $scope.isLoading = false;
          },
          function (errorMessage) {
              $scope.isLoading = false;
              notificationService.error(errorMessage);
          });
      };

      $scope.checkLogin = true;
      userService.isLoggedIn().then(function (user) {
          $scope.checkLogin = false;
          if (!user) {
              return;
          }
          $state.transitionTo('designer.bookingCalendar');
      }, function (errMsg) {
          $scope.checkLogin = false;
          otificationService.error(errorMessage);
      });
      
      $scope.changePassword = function () {
          $state.transitionTo('changePassword');
      };
  }]);
