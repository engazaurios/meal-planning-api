'use strict';

module.exports = function(UserMenu) {
  UserMenu.getMenusPerDate = function(userId, startDate, endDate, callback) {
    console.log(startDate);
    console.log(endDate);
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
};
