'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('changePasswordCtrl', ['$scope',  '$state', 'userService', 'notificationService',
      function ($scope, $state, userService, notificationService) {
          $scope.isLoading = false;
          $scope.email = '';
          
          $scope.changePassword = function () {
              $scope.isLoading = true;
              userService.changePassword($scope.email).then(function (msg) {
                  notificationService.info(msg);
                  $scope.isLoading = false;
                  $state.transitionTo('login');
              },
              function (errorMessage) {
                  notificationService.error(errorMessage);
                  $scope.isLoading = false;
              });
          };

          $scope.cancel = function () {
              $state.transitionTo('login');
          };
      }]);