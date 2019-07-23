/* jshint esversion: 6 */
'use strict';

var currentWeekNumber = require('current-week-number');

const getDateWithoutTime = (date) => {
  return date.getFullYear() + '-' +
  (date.getMonth() + 1) + '-' +
  date.getDate();
};

const getDayInfo = (day) => {
  return {
    'date': getDateWithoutTime(day),
    'dateId': new Date(getDateWithoutTime(day)),
    'day': day.getDate(),
    'month': day.getMonth() + 1,
    'year': day.getFullYear(),
    'week': currentWeekNumber(day),
    'weekend': (day.getDay() == 0 || day.getDay() == 6),
  };
};
const getDates = (startDate, endDate) => {
  var currentDate = startDate;
  var dates = [];

  while (currentDate <= endDate) {
    dates.push(getDayInfo(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const getWholeWeek = (startDate) => {
  const dates = [];
  for (var i = 0; i < 7; i++) {
    dates.push(getDayInfo(startDate));
    startDate.setDate(startDate.getDate() + 1);
  }
  return dates;
};

module.exports = {
  getDates,
  getDateWithoutTime,
  getWholeWeek,
};
