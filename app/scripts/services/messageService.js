angular.module('designerWorkplaceApp').factory('messageService', ['$http', '$q', 'dataService', function ($http, $q, dataService) {
    'use strict';

    function createMessage(data) {
        return {
            id: data.Id,

            userBookingForExchange: {
                id: data.PairWorkTimetableId,
                date: moment(data.PairWorkDate),
                studio: {
                    id: data.PairStudioId,
                    name: data.PairStudioName
                },
                workplace: {
                    id: data.PairWorkplaceId,
                    title: data.PairWorkplaceName
                }
            },
            proposeBookingForExchange: {
                id: data.WorkTimetableId,
                date: moment(data.WorkDate),
                studio: {
                    id: data.StudioId,
                    name: data.StudioName
                },
                workplace: {
                    id: data.WorkplaceId,
                    title: data.WorkplaceName
                },
                user: {
                    id: data.SenderId,
                    name: data.SenderName
                }
            },
            servData_: data,
            isRead: data.StateId !== 'e5a7339e-7e76-4111-8e66-1599d17146df'
        };
    }

    function createMessagesInfo(data) {
        return {
            newMessagesCount: data.NewCount,
            messagesCount: data.TotalCount,
            servData_: data,
        };
    }

    function getMessages(user) {
        return dataService.getList('/DesignerWorkplace/GetInputWorkTimetableExchanges',
            {
                JobPositionId: user.jobPositionId
            }, createMessage, 'Произошла ошибка при получении сообщений');
        
    }

    function checkMessages(user, lastCheckTime) {
        return dataService.get('/DesignerWorkplace/HasInputMessages',
           {
               JobPositionId: user.jobPositionId,
               Date: lastCheckTime.format('YYYY-MM-DDTHH:mm:ss')
           }, createMessagesInfo, 'Произошла ошибка при получении сообщений');
    }

    return {
        getMessages: getMessages,
        checkMessages: checkMessages
    };
}]);