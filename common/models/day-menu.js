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
};
