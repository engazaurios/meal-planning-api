/* jshint esversion: 6 */
'use strict';

var currentWeekNumber = require('current-week-number');
var {getDates, getWholeWeek, getDateWithoutTime} = require('../helpers/date-helper.js');
var {getData} = require('../helpers/data-provider.js');

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
          where: {and: [
            {date: date.dateId},
            {status: 'APPROVED'},
          ]},
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
          userMenu.menus.destroyAll(err => {
            if (err) return reject(err);
            userMenu.menus.add(menuId, err=> {
              if (err) {
                return reject(err);
              }
              resolve(menuId);
            });
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

  UserMenu.createReport = (startDate, endDate, costCenters, users, callback) => {
    const models = UserMenu.app.models;
    console.log(startDate);
    console.log(endDate);
    console.log(costCenters);
    console.log(users);
    const data = getData(models, startDate, endDate, costCenters, users);
    data.then(result => {
      callback(null, result);
    });
  };

  UserMenu.approve = (startDate, userId, callback) => {
    if (startDate.getDay() != 1) {
      callback(null, {message: 'Invalid date'});
      return;
    }
    const dates = getWholeWeek(startDate).map(date => date.dateId);

    UserMenu.find({
      where: {
        and: [
          { userId: userId },
          { date: { inq: dates } },
        ]
      }
    }).then(userMenus => {
      return userMenus.filter(userMenu => {
        return userMenu.menus().length;
      });
    }).then(userMenus => {
      return Promise.all(userMenus.map(userMenu => {
        return new Promise((resolve, reject) => {
          userMenu.updateAttributes({
            status: 'APPROVED'
          }, (error, userMenuUpdated) => {
            if (error) reject(error);
            resolve(userMenuUpdated);
          });
        });
      }));
    }).then(result => {
      callback(null, result);
    });
  }

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

  UserMenu.remoteMethod('createReport', {
    http: {
      path: '/Report',
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
      {
        arg: 'costCenters',
        type: 'array',
        require: false,
      },
      {
        arg: 'users',
        type: 'array',
        require: false,
      }
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });

  UserMenu.remoteMethod('approve', {
    http: {
      path: '/Approve',
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
      {
        arg: 'userId',
        type: 'String',
        required: true,
        description: 'The user that is approving his menus',
        http: {
          source: 'form',
        }
      },
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });
};
