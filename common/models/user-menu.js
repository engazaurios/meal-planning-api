/* jshint esversion: 6 */
'use strict';

var currentWeekNumber = require('current-week-number');
var {getDates, getWholeWeek, getDateWithoutTime} = require('../helpers/date-helper.js');

module.exports = function(UserMenu) {
  UserMenu.getMenusPerDate = function(userId, startDate, endDate, callback) {
    var DayMenu = UserMenu.app.models.DayMenu;
    var dates = getDates(startDate, endDate);

    Promise.all(dates.map(function(date) {
      return UserMenu.findOne({
        where: {and: [
          {date: date.dateId},
          {userId: userId},
        ]},
      })
      .then(function(userMenu) {
        date.userMenu = userMenu;
        return  date;
      });
    })).then(function(dates) {
      return Promise.all(dates.map(function(date) {
        return DayMenu.findOne({
          where: {
            date: date.dateId,
          },
        })
        .then(function(dayMenu) {
          date.dayMenu = dayMenu;
          return  date;
        });
      }));
    }).then(function(result) {
      callback(null, result);
    });
  };

  UserMenu.publishDayMenus = function(startDate, callback) {
    var AppUser = UserMenu.app.models.AppUser;

    if (startDate.getDay() != 1) {
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
            status: 'PENDING',
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

  UserMenu.getUserMenuPerDate = function(userId, date, callback) {
    console.log(userId);
    console.log(date);
    UserMenu.findOne({
      where: {
        userId: userId,
        date: date,
      },
    })
    .then(function(user) {
      callback(null, user);
    });
  };

  UserMenu.saveMenus = function(userId, date, menusId, callback) {
    UserMenu.findOne({
      where: {
        and: [
          {userId: userId},
          {date: date}
        ]
      }
    }).then(userMenu => {
      const operations = menusId.map(menuId => {
        return new Promise((resolve, reject) => {
          userMenu.menus.add(menuId, err=> {
            if (err) {
              return reject(err);
            }
            resolve(menuId);
          });
        });
      });
      
      Promise.all(operations)
      .then(result => {
        return new Promise((resolve, reject) => {
          userMenu.reload((error, instance) => {
            if (error) reject(error);
            return resolve(instance);
          });
        });
      }).then(userMenu => {
        return new Promise((resolve, reject) => {
          userMenu.updateAttributes({
            status: 'SENT'
          }, (error, userMenuUpdated) => {
            if (error) reject(error);
            
            resolve(userMenuUpdated);
          });
        });
      }).then(userMenuUpdated => {
        callback(null, {
          status: 'OK',
          message: 'The menus were inserted correctly',
          userMenu: userMenuUpdated
        });
      }).catch(error => {
        throw error;
      });
    });
  };

  UserMenu.remoteMethod('getMenusPerDate', {
    http: {
      path: '/MenusPerDate/:userId/:startDate/:endDate',
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

  UserMenu.remoteMethod('getUserMenuPerDate', {
    http: {
      path: '/UserMenuPerDate/:userId/:date',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'userId',
        type: 'String',
        required: true,
      },
      {
        arg: 'date',
        type: 'date',
        required: true,
      },
    ],
    returns: {
      arg: 'userMenus',
      type: 'object',
    },
  });

  UserMenu.remoteMethod('saveMenus', {
    http: {
      path: '/SaveMenus',
      verb: 'post',
    },
    accepts: [
      {
        arg: 'userId',
        type: 'String',
        required: true,
      },
      {
        arg: 'date',
        type: 'date',
        required: true,
      },
      {
        arg: 'menusId',
        type: 'array',
        require: true,
      }
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });
};
