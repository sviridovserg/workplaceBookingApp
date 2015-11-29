'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:bookingCalendarCtrl
 * @description
 * # bookingCalendarCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('designerScheduleCtrl', ['$scope', 'workplaceService', 'calendarService', 'notificationService', 'userService', 'defaultValueService',
      function ($scope, workplaceService, calendarService, notificationService, userService, defaultValueService) {
          var viewKey = 'designer_schedule';
          var defaultValues = defaultValueService.get(viewKey);

          var currentUser = userService.getCurrentUser();
          function initMonthes() {
              $scope.isLoading = true;
              workplaceService.getScheduledMonths(currentUser).then(
                  function (monthes) {
                      $scope.monthes = [];
                      for (var i = 0; i < monthes.length; i++)
                      {
                          var date = new Date(monthes[i].year, monthes[i].month, 1);
                          $scope.monthes.push({
                              value: date,
                              title: moment(date).format('MMMM YYYY')
                          });
                      }
                      $scope.selectedMonth = moment(defaultValues.selectedMonth || $scope.monthes[$scope.monthes.length - 1].date).format('MMMM YYYY');
                      $scope.isLoading = false;
                  });
          }
          initMonthes();

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

              getSchedule(date);
              updateDefaults('selectedMonth', calendarService.removeTime(moment(getSelectedMonth())).toDate());
          });

          $scope.isDateValid = function (date) {
              return date.isSame(calendarService.removeTime(moment())) || date.isAfter(calendarService.removeTime(moment()));
          };

          function updateDefaults(prop, value) {
              defaultValues[prop] = value;
              defaultValueService.set(viewKey, defaultValues);
          }

          function getSelectedMonth() {
              return _.findWhere($scope.monthes, { title: $scope.selectedMonth }).value;
          }

          function getSchedule(date) {
              $scope.isLoading = true;
              workplaceService.getDesignerSchedule(currentUser, moment(date).year(), moment(date).month() + 1).then(function (workplaceSchedule) {

                  _.each($scope.weeks, function (w) {
                      _.each(w.days, function (d) {
                          if (!d.isCurrentMonth) {
                              return;
                          }
                          var reservation = _.find(workplaceSchedule, function (a) { return a.date.get('date') === d.date.get('date'); });
                          d.reservation = reservation;
                      });
                  });
                  $scope.isLoading = false;
              }, function (errMsg) {
                  $scope.isLoading = false;
                  notificationService.error(errMsg);
              });
          }

          
      }]);