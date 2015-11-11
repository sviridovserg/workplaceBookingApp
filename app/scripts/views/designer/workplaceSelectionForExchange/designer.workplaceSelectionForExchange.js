angular.module('designerWorkplaceApp')
  .controller('workplaceSelectionForExchangeCtrl', ['$scope', '$mdDialog', 'studioService', 'userService', 'workplaceService',
      function ($scope, $mdDialog, studioService, userService, workplaceService) {
          'use strict';
          
          $scope.isLoading = true;
          workplaceService.getBookedWorkplaces(userService.getCurrentUser()).then(function (bookings) {
              $scope.bookings = bookings;

              var availableBooking = _.find($scope.bookings, function (b) { return !b.isExchangeProposed; });
              if (availableBooking) {
                  $scope.selectedBookingId = availableBooking.id;
              }
              $scope.isLoading = false;
          });
          
          $scope.hide = function () {
              $mdDialog.hide();
          };
          $scope.cancel = function () {
              $mdDialog.cancel();
          };
          $scope.ok = function () {
              var selectedBooking = _.findWhere($scope.bookings, { id: $scope.selectedBookingId });
              $mdDialog.hide({ booking: selectedBooking });
          };
      }]);