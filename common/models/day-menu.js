'use strict';

var { getWholeWeek } = require('../helpers/date-helper.js');

module.exports = function(DayMenu) {
  /* Validations */
  DayMenu.validatesUniquenessOf('date', {
    message: 'A DayMenu already exists for this date. You must remove it first'
  });

  DayMenu.getMenusPerDate = function(startDate, endDate, callback) {
    DayMenu.find({
      where: {and: [
        {date: {gte: startDate}},
        {date: {lte: endDate}},
      ]},
    }, function(err, menus) {
      if (err) {
        throw err;
      }
      callback(null, menus);
    });
  };

  DayMenu.publishDayMenus = function(startDate, callback) {
    const AppUser = DayMenu.app.models.AppUser;
    const UserMenu = DayMenu.app.models.UserMenu;

    if (startDate.getDay() != 1) {
      callback(null, {message: 'Invalid date'});
      return;
    }
    const dates = getWholeWeek(startDate);
    AppUser.find({}).then(users => {
      var list = users.reduce((accumulator, user) => {
        var creations = dates.reduce((accumulator, date) => {
          if (date.weekend) {
            return accumulator;
          }
          var creation = UserMenu.create({
            userId: user.id,
            status: 'PENDING',
            date: date.dateId,
          });
          return accumulator.concat(creation);
        }, []);
        return accumulator.concat(creations);
      }, []);
      Promise.all(list).then(result => {
        return DayMenu.updateAll({
          date: { inq: dates.map(date => date.dateId) }
        }, {
          status: 'APPROVED'
        });
      }).then(result => {
        callback(null, result);
      });
    });
  };

  /* Remote methods definition */

  DayMenu.remoteMethod('getMenusPerDate', {
    http: {
      path: '/MenusPerDate/:startDate/:endDate',
      verb: 'get',
    },
    accepts: [
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

  DayMenu.remoteMethod('publishDayMenus', {
    http: {
      path: '/PublishDayMenus',
      verb: 'post',
    },
    accepts: [
      {
        arg: 'startDate',
        type: 'date',
        required: true,
        description: 'The start day of the week, that you want to publish',
        http: {
          source: 'form',
        },
      },
    ],
    returns: {
      arg: 'userMenus',
      type: 'array',
    },
  });
};
