angular.module('designerWorkplaceApp').factory('workplaceService', ['$q', 'dataService', function ($q, dataService) {
    'use strict';

    function getBookedWorkplaces(user) {
        return dataService.getList('/DesignerWorkplace/GetWorkTimetablesByJobPosition',
            {
                JobPositionId: user.jobPositionId,
                BeginDate: moment().format('YYYY-MM-DD')
            }, createWorkplaceAvailability, 'Произошла ошибка при получении забронированных мест');
    }

    function createWorkplaceAvailability(data) {
        var result = {
            id: data.Id,
            servData_: data,
            workplace: {
                id: data.WorkplaceId,
                title: data.WorkplaceName
            },
            startTime: moment(data.WorkHoursBegin),
            endTime: moment(data.WorkHoursEnd),
            date: moment(data.Date),
            bookingId: data.WorkTimetableId,
            isExchangeProposed: data.HasExchange
        };
        if (data.JobPositionId) {
            result.designer = {
                id: data.JobPositionId,
                name: data.JobPositionName
            };
        }
        if (data.StudioId) {
            result.studio = {
                id: data.StudioId,
                name: data.StudioName
            };
        }
        return result;
    }

    function getWorkplaceAvailablityForDate(studioId, user, date) {
        return dataService.getList('/DesignerWorkplace/GetStudioWorkplaceDetail',
            {
                StudioId: studioId,
                Date: date.format('YYYY-MM-DD'),
                JobPositionId: user.jobPositionId
            }, createWorkplaceAvailability, 'Произошла ошибка при получении информации по загрузки студии на дату');
    }

    function getDesignerSchedule(user, year, month) {
        return dataService.getList('/DesignerWorkplace/GetDesignerSchedule',
            {
                JobPositionId: user.jobPositionId,
                Year: year,
                Month: month
            }, createWorkplaceAvailability, 'Произошла ошибка при получении расписания работы');
    }

    function bookWorkspace(studioId, user, workplaceAvailability) {
        var startTime = workplaceAvailability.startTime; //moment().hour(0).minute(0).second(0).millisecond(0);
        var endTime = workplaceAvailability.endTime;
        //startTime.hours(workplaceAvailability.startTime);
        //var endTime = moment().hour(0).minute(0).second(0).millisecond(0);
        //endTime.hours(workplaceAvailability.endTime);

        return dataService.get('/DesignerWorkplace/ReserveWorkplace',
            {
                WorkplaceId: workplaceAvailability.workplace.id,
                JobPositionId: user.jobPositionId,
                Date: workplaceAvailability.date.format('YYYY-MM-DD'),
                WorkHoursBegin: startTime.format('YYYY-MM-DDTHH:mm:ss'),
                WorkHoursEnd: endTime.format('YYYY-MM-DDTHH:mm:ss')
            }, undefined, 'Произошла ошибка при бронировании рабочего места');
    }

    function proposeExchangeWorkplace(user, workplace, date) {
        return dataService.get('/DesignerWorkplace/CreateWorkTimetableExchangeByWorkplaceAndDate',
            {
                WorkplaceId: workplace.id,
                Date: date.format('YYYY-MM-DD'),
                SenderId: user.jobPositionId
            }, null, 'Произошла ошибка при выставлении рабочего места на обмен');
    }

    function acceptExchangeWorkplace(user, proposedWorkplace, userBooking) {
        return dataService.get('/DesignerWorkplace/CreatePairWorkTimetableExchangeByWorkTimetable',
            {
                WorkTimetableId: userBooking.id,
                PairWorkTimetableId: proposedWorkplace.bookingId,
                SenderId: user.jobPositionId
            }, null, 'Произошла ошибка при выставлении встречного предложения на обмен');
    }

    function finishExchangeWorkplace(user, exchangeId) {
        return dataService.get('/DesignerWorkplace/AcceptWorkTimetableExchange',
            {
                WorkTimetableExchangeId: exchangeId,
                JobPositionId: user.jobPositionId
            }, null, 'Произошла ошибка при подтверждении обмена');
    }

    function declineExchangeWorkplace(user, exchangeId) {
        return dataService.get('/DesignerWorkplace/RejectWorkTimetableExchange',
            {
                WorkTimetableExchangeId: exchangeId,
                JobPositionId: user.jobPositionId
            }, null, 'Произошла ошибка при отклонении обмена');
    }


    return {
        getBookedWorkplaces: getBookedWorkplaces,
        getWorkplaceAvailablityForDate: getWorkplaceAvailablityForDate,
        getDesignerSchedule: getDesignerSchedule,
        bookWorkspace: bookWorkspace,
        proposeExchangeWorkplace: proposeExchangeWorkplace,
        acceptExchangeWorkplace: acceptExchangeWorkplace,
        finishExchangeWorkplace: finishExchangeWorkplace,
        declineExchangeWorkplace: declineExchangeWorkplace
    };
}]);