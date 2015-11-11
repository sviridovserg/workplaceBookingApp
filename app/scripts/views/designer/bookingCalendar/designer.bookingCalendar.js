'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:bookingCalendarCtrl
 * @description
 * # bookingCalendarCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('bookingCalendarCtrl', ['$scope', '$mdDialog', '$mdToast', 'studioService', 'workplaceService', 'calendarService', 'notificationService', 'userService', 'defaultValueService',
      function ($scope, $mdDialog, $mdToast, studioService, workplaceService, calendarService, notificationService, userService, defaultValueService) {

          var viewKey = 'designer_studiocalendar';
          var defaultValues = defaultValueService.get(viewKey);

          var currentUser = userService.getCurrentUser();
          function initMonthes() {
              var now = new Date();
              var nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

              $scope.monthes = [];
              for (var i = 0; i < 5 ; i++) {
                  var date = moment(nowDate).add(i, 'month').toDate();

                  $scope.monthes.push({
                      value: date,
                      title: moment(date).format('MMMM YYYY')
                  });
              }

              $scope.selectedMonth = moment(defaultValues.selectedMonth || nowDate).format('MMMM YYYY');
          }
          initMonthes();

          studioService.getStudios().then(function (studios) {
              $scope.studios = studios;
              $scope.selectedStudioId = defaultValues.selectedStudioId || studios[0].id;
          });




          $scope.$watch('selectedMonth', function (newVal) {
              if (newVal === undefined) {
                  return;
              }
              var date = getSelectedMonth();
              var selected = calendarService.removeTime(moment(date));
              $scope.month = selected.clone();

              var start = selected.clone();
              start.date(1);
              calendarService.removeTime(start.weekday(0));

              $scope.weeks = calendarService.buildMonth(start, $scope.month);

              getAvailability(date);
              updateUnusedWorkHours(date);
              updateDefaults('selectedMonth', calendarService.removeTime(moment(getSelectedMonth())).toDate());
          });

          $scope.$watch('selectedStudioId', function (newVal) {
              if (newVal === undefined) {
                  return;
              }
              $scope.selectedStudio = _.findWhere($scope.studios, { id: $scope.selectedStudioId });
              getAvailability(getSelectedMonth());
              updateDefaults('selectedStudioId', $scope.selectedStudioId);
          });

          $scope.isDateValid = function (date) {
              return date.isSame(calendarService.removeTime(moment())) || date.isAfter(calendarService.removeTime(moment()));
          };

          $scope.selectDay = function (day) {
              if (!day.isCurrentMonth || !day.availability || !$scope.isDateValid(day.date) || (day.availability.startTime === day.availability.endTime)) {
                  return;
              }
              $mdDialog.show({
                  controller: 'workplaceBookingCtrl',
                  templateUrl: 'scripts/views/designer/workplaceBooking/designer.workplaceBooking.html',
                  parent: angular.element(document.body),
                  //targetEvent: ev,
                  clickOutsideToClose: true,
                  locals: {
                      date: day.date,
                      studioId: $scope.selectedStudioId
                  }
              })
              .then(function (result) {
                  if (result.state === 'book') {
                      bookWorkplace(result.availability);
                  } else if (result.state === 'exchange') {
                      exchangeWorkplace(result.workplaceForExchange);
                  }
              }, function () {
              });

          };

          $scope.isFullyBooked = function (day) {
              return day.availability && day.availability.availablePaces === 0 && (day.availability.startTime !== day.availability.endTime);
          };

          $scope.hasFreeWorkplaces = function (day) {
              return day.availability && day.availability.availablePaces && day.availability.availablePaces !== 0 && (day.availability.startTime !== day.availability.endTime);
          };

          function updateDefaults(prop, value) {
              defaultValues[prop] = value;
              defaultValueService.set(viewKey, defaultValues);
          }

          function getSelectedMonth() {
              return _.findWhere($scope.monthes, { title: $scope.selectedMonth }).value;
          }

          function updateUnusedWorkHours(date) {
              userService.getUnusedWorkHours(currentUser, moment(date).year(), moment(date).month() + 1)
                .then(function (text) {
                    var strs = text.split(':');
                    $scope.unusedWorkHours = strs[1];
                    $scope.unusedWorkHoursTitle = strs[0];
                },
                function (errMsg) {
                    notificationService.error(errMsg);
                });
          }

          function getAvailability(date) {
              if ($scope.selectedStudioId === undefined) {
                  return;
              }
              $scope.isLoading = true;
              studioService.getMonthAvailability($scope.selectedStudioId, currentUser, moment(date).year(), moment(date).month() + 1).then(function (workplaceAvailablity) {

                  _.each($scope.weeks, function (w) {
                      _.each(w.days, function (d) {
                          if (!d.isCurrentMonth) {
                              return;
                          }
                          var availability = _.find(workplaceAvailablity, function (a) { return a.date.get('date') === d.date.get('date'); });
                          d.availability = availability;
                      });
                  });
                  $scope.isLoading = false;
              }, function (errMsg) {
                  $scope.isLoading = false;
                  notificationService.error(errMsg);
              });
          }

          function exchangeWorkplace(proposedBooking) {
              $mdDialog.show({
                  controller: 'workplaceSelectionForExchangeCtrl',
                  templateUrl: 'scripts/views/designer/workplaceSelectionForExchange/designer.workplaceSelectionForExchange.html',
                  parent: angular.element(document.body),
                  clickOutsideToClose: true
              }).then(function (result) {
                  if (result && result.booking) {
                      workplaceService.acceptExchangeWorkplace(currentUser, proposedBooking, result.booking).then(
                          function () {
                              notificationService.info('Рабочее место предоставлено на обмен');
                              getAvailability(getSelectedMonth());
                          }, function (errMsg) {
                              notificationService.error(errMsg);
                          });
                  }
              });
          }

          function bookWorkplace(workplaceAvailablity) {
              if (workplaceAvailablity && workplaceAvailablity.workplace) {
                  workplaceService.bookWorkspace($scope.selectedStudioId, currentUser, workplaceAvailablity)
                      .then(function () {
                          notificationService.info('Рабочее место зарезервировано!');
                          updateUnusedWorkHours(getSelectedMonth());
                          getAvailability(getSelectedMonth());
                      }, function (errMsg) {
                          notificationService.error(errMsg);
                      });
              }
          }

      }]);
