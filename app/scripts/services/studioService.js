angular.module('designerWorkplaceApp').factory('studioService', ['dataService', function (dataService) {
    'use strict';
    function createAvailability(data) {
        return {
            date: moment(data.Date),
            availablePaces: data.FreeCount,
            totalPlaces: data.TotalCount,
            isExchangeProposed: data.HasExchange && !data.HasOutputExchange && !data.IsReserved,
            isReserved: data.IsReserved,
            startTime: moment(data.WorkHoursBegin),
            endTime: moment(data.WorkHoursEnd),
            servData_: data
        };
    }

    function getMonthAvailability(studioId, user, year, month) {
        return dataService.getList('/DesignerWorkplace/GetStudioParamsByJobPosition',
            {
                StudioId: studioId,
                JobPositionId: user.jobPositionId,
                Year: year,
                Month: month
            }, createAvailability, 'Произошла ошибка при загрузки календаря для студии');
    }

    function createStudio(data) {
        return {
            id: data.Id,
            name: data.Name,
            workplaceCount: data.WorkplaceCount,
            servData_: data
        };
    }

    function getStudios() {
        return dataService.getList('/DesignerWorkplace/GetAllStudios', undefined, createStudio, 'Произошла ошибка при получении списка студий');
    }

   
    return {
        getMonthAvailability: getMonthAvailability,
        getStudios: getStudios
    };
}]);