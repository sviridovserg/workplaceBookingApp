angular.module('designerWorkplaceApp')
  .controller('messagesCtrl', ['$scope', '$mdSidenav', 'messageService', 'userService', 'workplaceService', 'notificationService',
      function ($scope, $mdSidenav, messageService, userService, workplaceService, notificationService) {
      'use strict';
      var currentUser = userService.getCurrentUser();

      function getMessages() {
          $scope.isLoading = true;
          messageService.getMessages(currentUser).then(function (messages) {
              $scope.messages = messages;
              $scope.isLoading = false;
          });
      }

      $scope.acceptMessage = function (m) {
          m.isProcessing = true;
          workplaceService.finishExchangeWorkplace(currentUser, m.id)
            .then(function () {
                notificationService.info('Обмен принят');
                m.isRead = true;
                m.isProcessing = false;
            },
            function (errMsg) {
                notificationService.error(errMsg);
                m.isProcessing = false;
            });
      };

      $scope.declineMessage = function (m) {
          m.isProcessing = true;
          workplaceService.declineExchangeWorkplace(currentUser, m.id)
            .then(function () {
                notificationService.info('Обмен отклонен');
                m.isRead = true;
                m.isProcessing = false;
            },
            function (errMsg) {
                notificationService.error(errMsg);
                m.isProcessing = false;
            });
      };

      $scope.$on('messagesOpen', function () {
          getMessages();
      });
  }]);