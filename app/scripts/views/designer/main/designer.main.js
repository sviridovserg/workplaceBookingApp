'use strict';

/**
 * @ngdoc function
 * @name designerWorkplaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the designerWorkplaceApp
 */
angular.module('designerWorkplaceApp')
  .controller('designerMainCtrl', ['$scope', '$mdSidenav', '$mdToast', '$mdUtil', '$state', '$document', '$timeout', '$interval', 'userService', 'messageService',
      function ($scope, $mdSidenav, $mdToast, $mdUtil, $state, $document, $timeout, $interval, userService, messageService) {
      $scope.menu = {};
      /**
       * Build handler to open/close a SideNav; when animation finishes
       * report completion in console
       */
      function buildToggler(navID) {
          var debounceFn = $mdUtil.debounce(function () {
              $mdSidenav(navID)
                .open();
              if (navID === 'messages') {
                  $scope.hasNewMessages = false;
                  $scope.$broadcast('messagesOpen');
              }
                  
          }, 200);
          return debounceFn;
      }

      $scope.openMenu = function($mdOpenMenu, ev) {
          $mdOpenMenu(ev);
      };

      $scope.help = function () {
          var hiddenIframe = angular.element('<iframe></iframe>');
          hiddenIframe.css('display', 'none');
          hiddenIframe.attr('target', '_blank');
          hiddenIframe.attr('src', ' http://188.227.19.222/DesignerWorkplace/Manual/Инструкция по бронированию рабочих мест дизайнером.docx');
          var body = $document.find('body').eq(0);
          body.append(hiddenIframe);
          $timeout(function () {
              hiddenIframe.detach();
          }, 5000);
      };

      $scope.currentUser = userService.getCurrentUser();

      $scope.showMessages = buildToggler('messages');
        
      var lastMessagesCheckDate = moment();
      var stop = $interval(function () {
          checkMessages();
      }, 120000);
    
      function checkMessages() {
          messageService.checkMessages($scope.currentUser, lastMessagesCheckDate)
              .then(function (messagesInfo) {
                  if (messagesInfo.newMessagesCount > 0) {
                      showNewMessagesNotification(messagesInfo.newMessagesCount);
                  }
                  lastMessagesCheckDate = moment();
              });
      }

      messageService.checkMessages($scope.currentUser, lastMessagesCheckDate)
           .then(function (messagesInfo) {
               if (messagesInfo.messagesCount > 0) {
                   $mdToast.show({
                       controller: ['$scope', '$mdToast', function ($scope, $mdToast) {
                           $scope.goToMessages = function () {
                               $mdToast.hide();
                           };
                           $scope.close = function () {
                               $mdToast.cancel();
                           };
                       }],
                       template: '<md-toast class="new-message-notification">У вас есть непрочитанные сообщения&nbsp;<span flex class="new-message-notification-text" ng-click="goToMessages()">Перейти...</span><md-button ng-click="close()"><md-icon md-font-set="material-icons">close</md-icon></md-button></md-toast>',
                       position: 'top right',
                       hideDelay: 0
                   }).then(function () {
                       $scope.showMessages();
                   });
               }
           });

      
      function showNewMessagesNotification(newMessageCount) {
          $mdToast.show({
              controller: ['$scope', '$mdToast', function ($scope, $mdToast) {
                  $scope.goToMessages = function () {
                      $mdToast.hide();
                  };

                  $scope.close = function () {
                      $mdToast.cancel();
                  };
                  $scope.newMessagesCount = newMessageCount;
              }],
              template: '<md-toast class="new-message-notification">Новые сообщения: <span flex class="new-message-notification-text" ng-click="goToMessages()">{{newMessagesCount}}</span><md-button ng-click="close()"><md-icon md-font-set="material-icons">close</md-icon></md-button></md-toast>',
              position: 'top right',
              hideDelay: 0
          }).then(function () {
              $scope.showMessages();
          });
      }
      
      $scope.$on('$destroy', function () {
          if (angular.isDefined(stop)) {
              $interval.cancel(stop);
              stop = undefined;
          }
      });

      $scope.logout = function () {
          userService.logout().then(function () {
              $state.transitionTo('login');
          });
      };

      $scope.closeMessages = function () {
          $mdSidenav('messages').close();
      };

      $state.transitionTo('designer.bookingCalendar');
  }]);
