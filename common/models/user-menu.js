/* jshint esversion: 6 */
'use strict';

var currentWeekNumber = require('current-week-number');
var {getDates, getWholeWeek, getDateWithoutTime} = require('../helpers/date-helper.js');

module.exports = function(UserMenu) {
  UserMenu.getMenusPerDate = function(userId, startDate, endDate, callback) {
    var DayMenu = UserMenu.app.models.DayMenu;
    var dates = getDates(startDate, endDate);

    Promise.all(dates.map(function(date) {
      return UserMenu.find({
        where: {and: [
          {date: date.dateId},
          {userId: userId},
        ]},
      })
      .then(function(menus) {
        date.menus = menus;
        return  date;
      });
    })).then(function(dates) {
      return Promise.all(dates.map(function(date) {
        return DayMenu.find({
          where: {
            date: date.dateId,
          },
        })
        .then(function(dayMenus) {
          date.dayMenus = dayMenus;
          return  date;
        });
      }));
    }).then(function(result) {
      callback(null, result);
    });
  };

  UserMenu.publishDayMenus = function(startDate, callback) {
    var AppUser = UserMenu.app.models.AppUser;

    if (startDate.getDay() != 0) {
      callback(null, {message: 'Invalid date'});
      return;
    }
    var dates = getWholeWeek(startDate);
    AppUser.find({}).then(users => {
      var list = users.reduce((accumulator, user) => {
        var creations = dates.reduce((accumulator, date) => {
          if (date.weekend) {
            return accumulator;
          }
          var creation = UserMenu.create({
            userId: user.id,
            status: 'O',
            date: date.dateId,
          });
          return accumulator.concat(creation);
        }, []);
        return accumulator.concat(creations);
      }, []);
      Promise.all(list).then(result => {
        callback(null, result);
      });
    });
  };

  UserMenu.remoteMethod('getMenusPerDate', {
    http: {
      path: '/menus-per-date/:userId/:startDate/:endDate',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'userId',
        type: 'string',
        required: true,
      },
      {
        arg: 'startDate',
        type: 'date',
        required: true,
      },
      {
        arg: 'endDate',
        type: 'date',
        required: true,
      },
    ],
    returns: {
      arg: 'menus',
      type: 'array',
    },
  });

  UserMenu.remoteMethod('publishDayMenus', {
    http: {
      path: '/publish-day-menus/:startDate',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'startDate',
        type: 'date',
        required: true,
      },
    ],
    returns: {
      arg: 'userMenus',
      type: 'array',
    },
  });
};
