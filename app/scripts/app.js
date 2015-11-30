'use strict';

/**
 * @ngdoc overview
 * @name designerWorkplaceApp
 * @description
 * # designerWorkplaceApp
 *
 * Main module of the application.
 */
angular
  .module('designerWorkplaceApp', [
    'ngCookies',
    'ngStorage',
    'ui.router',
    'ngMaterial',
    'ui.bootstrap',
    'pascalprecht.translate'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
      //
      // For any unmatched url, redirect to /state1
      $urlRouterProvider.otherwise('/login');
      //
      // Now set up the states
      $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'scripts/views/login/login.html',
            controller: 'loginCtrl'
        })
        .state('designer', {
            url: '/designer',
            templateUrl: 'scripts/views/designer/main/designer.main.html',
            controller: 'designerMainCtrl'
        })
        .state('designer.bookingCalendar', {
            url: '/designer/bookingCalendar',
            templateUrl: 'scripts/views/designer/bookingCalendar/designer.bookingCalendar.html',
            controller: 'bookingCalendarCtrl'
        })
        .state('designer.schedule', {
            url: '/designer/schedule',
            templateUrl: 'scripts/views/designer/schedule/designer.schedule.html',
            controller: 'designerScheduleCtrl'
        })
        .state('changePassword', {
            url: '/changepassword',
            templateUrl: 'scripts/views/changePassword/changePassword.html',
            controller: 'changePasswordCtrl'
        });
  })
  .config(['$translateProvider', '$windowProvider', function ($translateProvider, $windowProvider) {
      var window = $windowProvider.$get();
      function mergeTranslations(tr, trPhone) {
          if (window.innerWidth < 768) {
              return angular.extend({}, tr, trPhone);
          }
          return angular.extend({}, tr);
      }
      $translateProvider.translations('ru', mergeTranslations(getLocalRu(), getLocalRuPhone()));
      $translateProvider.preferredLanguage('ru');
    }])
  .run(['$rootScope', '$state', 'userService', function ($rootScope, $state, userService) {
      $rootScope.$on('$stateChangeStart', function (event, toState) {
          if (userService.getCurrentUser() === null && toState.name !== 'login' && toState.name !== 'changePassword') {
              event.preventDefault();
              $state.go('login');
              return false;
          }
      });
  }])
.constant('appConfig', {
    //serviceUrl: 'http://188.227.19.222/DesignerWorkplace/api'
    serviceUrl: 'http://188.227.19.222/DesignerWorkplaceDebug/api',
    helpUrl: 'http://188.227.19.222/DesignerWorkplace/Manual/Инструкция по бронированию рабочих мест дизайнером.docx'
});
