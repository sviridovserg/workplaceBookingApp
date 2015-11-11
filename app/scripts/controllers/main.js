'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('mainCtrl', ['$scope', '$mdSidenav', '$mdUtil', 'userService', function ($scope, $mdSidenav, $mdUtil, userService) {
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
          var debounceFn = $mdUtil.debounce(function () {
              $mdSidenav(navID)
                .toggle();
          }, 200);
          return debounceFn;
      }

      userService.retrieveCurrentUser().then(function (user) {
          $scope.currentUser = user;
      });

      $scope.showMessages = buildToggler('messages');
      

      $scope.closeMessages = function () {
          $mdSidenav('messages').close();
      };
  }]);
