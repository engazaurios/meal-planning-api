'use strict';

module.exports = function(UserMenu) {
  UserMenu.getMenusPerDate = function(userId, startDate, endDate, callback) {
    UserMenu.find({
      where: {and: [
        {date: {gte: startDate}},
        {date: {lte: endDate}},
        {userId: userId},
      ]},
    }, function(err, menus) {
      if (err) {
        throw err;
      }
      callback(null, menus);
    });
  };

  UserMenu.getMenusPerDateCombined = function(userId, startDate, endDate, callback) {
    UserMenu.getMenusPerDate(userId, startDate, endDate, function(err, userMenus) {
      var DayMenu = UserMenu.app.models.DayMenu;
      DayMenu.getMenusPerDate(startDate, endDate, function(err, dayMenus) {
        var menus = userMenus.concat(dayMenus);
        callback(null, menus);
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

  UserMenu.remoteMethod('getMenusPerDateCombined', {
    http: {
      path: '/menus-per-date-combined/:userId/:startDate/:endDate',
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
};
