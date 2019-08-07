'use strict';

module.exports = function(DayMenu) {
  /* Validations */
  DayMenu.validatesUniquenessOf('date', {
    message: 'A DayMenu already exists for this date. You must remove it first'
  });

  DayMenu.getDayMenusPerDate = function(startDate, endDate, callback) {
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

  /* Remote methods definition */

  DayMenu.remoteMethod('getDayMenusPerDate', {
    http: {
      path: '/DayMenusPerDate/:startDate/:endDate',
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
