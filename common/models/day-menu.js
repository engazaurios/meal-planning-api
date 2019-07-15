'use strict';

module.exports = function(DayMenu) {
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

  DayMenu.publishDayMenus = function(year, weekNumber, callback) {
    var UserMenu = DayMenu.app.models.UserMenu;
    var DateModel = DayMenu.app.models.DateModel;
    var today = new Date();
    UserMenu.destroyAll({}, function(err, data) {
      DateModel.find({
        where: {
          and: [
            {year: year},
            {week: weekNumber},
          ],
        },
      }).then(function(dates) {
        return UserMenu.find({
        }).then(function(users) {
          var array = dates.map(date => {
            return users.map(user => {
              return UserMenu.create({
                userId: user.id,
                status: 'O',
                date: date.dateId,
              }).then(function(userMenu) {
                console.log(userMenu);
                return userMenu;
              });
            });
          });
          console.log(array);
          console.log(array.flat());
          return Promise.all(array.flat());
        }).then(function(userMenus) {
          return userMenus;
        });
      }).then(function(userMenus) {
        callback(null, userMenus);
      });
    });
  };

  DayMenu.remoteMethod('getMenusPerDate', {
    http: {
      path: '/menus-per-date/:startDate/:endDate',
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
      path: '/publish-day-menus/:year/:week',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'year',
        type: 'number',
        required: true,
      },
      {
        arg: 'week',
        type: 'number',
        required: true,
      },
    ],
    returns: {
      arg: 'userMenus',
      type: 'array',
    },
  });
};
