var currentWeekNumber = require('current-week-number');

module.exports = function roleCreation(app) {
  var DateModel = app.models.DateModel;
  var today = new Date();
  var startDate = new Date('2019-01-01');
  var endDate = today.setDate(today.getDate() + 365 * 3);
  var dates = [];

  DateModel.destroyAll({}, function() {
    while (startDate <= endDate) {
      dates.push({
        'dateId': startDate.toUTCString(),
        'day': startDate.getUTCDate(),
        'month': startDate.getUTCMonth() + 1,
        'year': startDate.getUTCFullYear(),
        'week': currentWeekNumber(startDate),
      });
      startDate.setDate(startDate.getDate() + 1);
    }
    console.log(dates.length);
    DateModel.create(dates, function cb(err, obj) {
      console.log('Awesome!');
    });
  });
};
