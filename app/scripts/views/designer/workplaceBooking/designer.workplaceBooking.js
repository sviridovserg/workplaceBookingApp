angular.module('designerWorkplaceApp')
  .controller('workplaceBookingCtrl', ['$scope', '$mdDialog', 'workplaceService', 'userService', 'notificationService', 'date', 'studioId',
      function ($scope, $mdDialog, workplaceService, userService, notificationService, date, studioId) {
          'use strict';
          $scope.dayTitle = date.format('DD MMMM YYYY');
          $scope.currentUser = userService.getCurrentUser();


          $scope.isWorkplaceAlreadyBooked = function () {
              if (!$scope.workplaces) {
                  return false;
              }
              return _.any($scope.workplaces, function (w) { return w.designer && w.designer.id === $scope.currentUser.jobPositionId; });
          };

          function getWorkplacesForDate() {
              $scope.isLoading = true;
              workplaceService.getWorkplaceAvailablityForDate(studioId, $scope.currentUser, date).then(function (workplaces) {
                  $scope.workplaces = workplaces;
                  var firstFree = _.find($scope.workplaces, function (w) { return w.designer === undefined; });
                  if (firstFree && !$scope.isWorkplaceAlreadyBooked()) {
                      $scope.selectedWorkplaceId = firstFree.workplace.id;
                  }
                  $scope.isLoading = false;
              }, function (msg) {
                  notificationService.error(msg);
                  $scope.isLoading = false;
              });
          }
          getWorkplacesForDate();

          $scope.proposeExchangeWorkplace = function (w) {
              workplaceService.proposeExchangeWorkplace($scope.currentUser, w.workplace, date).then(
                  function () {
                      notificationService.info('Рабочее место выставлено на обмен');
                      getWorkplacesForDate();
                  }, 
                  function (errMsg) {
                      notificationService.error(errMsg);
                  });
          };

          $scope.canExchange = function (w) {
              if (!w.isExchangeProposed || !w.designer || w.designer.id === $scope.currentUser.jobPositionId) {
                  return false;
              }
              return !_.any($scope.workplaces, function (wp) { return wp.designer && wp.designer.id === $scope.currentUser.jobPositionId; });
          };

          $scope.acceptExchangeWorkplace = function (w) {
              $mdDialog.hide({
                  state: 'exchange',
                  workplaceForExchange: w
              });
          };

          $scope.hide = function () {
              $mdDialog.hide();
          };
          $scope.cancel = function () {
              $mdDialog.cancel();
          };
          $scope.ok = function () {
              var selectedWorkplaceAvailability = _.find($scope.workplaces, function (w) { return w.workplace.id === $scope.selectedWorkplaceId; });
              $mdDialog.hide({
                  state: 'book',
                  availability: selectedWorkplaceAvailability 
              });
          };
      }]);