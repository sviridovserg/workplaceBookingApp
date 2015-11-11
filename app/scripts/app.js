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
    'ui.bootstrap'
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
      .state('changePassword', {
          url: '/changepassword',
          templateUrl: 'scripts/views/changePassword.html',
          controller: 'changePasswordCtrl'
      });
  })
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
    serviceUrl: 'http://188.227.19.222/DesignerWorkplaceDebug/api'
});
