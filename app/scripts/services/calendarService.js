angular.module('designerWorkplaceApp').factory('calendarService', [function () {
    'use strict';

    function removeTime_(date) {
        return date.hour(0).minute(0).second(0).millisecond(0);
    }

    function buildMonth_(start, month) {
        var weeks = [];
        var done = false, date = start.clone(), monthIndex = date.month(), count = 0;
        while (!done) {
            weeks.push({ days: buildWeek_(date.clone(), month) });
            date.add(1, 'w');
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }
        return weeks;
    }

    function buildWeek_(date, month) {
        var days = [];
        for (var i = 0; i < 7; i++) {
            days.push({
                name: date.format('dd').substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), 'day'),
                date: date
            });
            date = date.clone();
            date.add(1, 'd');
        }
        return days;
    }

    return {
        buildMonth: buildMonth_,
        removeTime: removeTime_
    };
}]);