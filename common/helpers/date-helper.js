/* jshint esversion: 6 */
'use strict';

var currentWeekNumber = require('current-week-number');

const getDateWithoutTime = (date) => {
  return date.getUTCFullYear() + '-' +
  (date.getUTCMonth() + 1) + '-' +
  date.getUTCDate();
};

const getDayInfo = (day) => {
  return {
    'date': getDateWithoutTime(day),
    'dateId': new Date(getDateWithoutTime(day)),
    'day': day.getUTCDate(),
    'month': day.getUTCMonth() + 1,
    'year': day.getUTCFullYear(),
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

const getDatesPerWeekNumber = (year, week) => {
  var dates = [];
  var day = new Date(year, 0, 1);
  while (day.getUTCFullYear() == year) {
    var dayInfo = getDayInfo(day);
    if (dayInfo.week == week) {
      for (var i = 0; i < 7; i++) {
        dates.push(dayInfo);
        day.setDate(day.getDate() + 1);
        dayInfo = getDayInfo(day);
      }
      console.log(dates);
      return dates;
    }
    day.setDate(day.getDate() + 1);
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
  getDatesPerWeekNumber,
  getDateWithoutTime,
  getWholeWeek,
};
