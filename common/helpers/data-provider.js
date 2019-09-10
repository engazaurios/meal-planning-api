/* jshint esversion: 6 */
'use strict';

const getData = (models, startDate, endDate, costCenters, users) => {
  const UserMenu = models.UserMenu;
  const AppUser = models.AppUser;

  return UserMenu.find({
    include: 'user',
    where: {and: [
      {date: {gte: startDate}},
      {date: {lte: endDate}},
      {userId: (users) ? {inq: users} : {nin: []}}
    ]},
  }).then(userMenus => {
    // Filter the included relation
    return userMenus.filter(userMenu => {
      if (!userMenu.user() || !userMenu.user().costCenter()) {
        return false;
      }
      if (costCenters && !costCenters.includes(userMenu.user().costCenterId.toString())) {
        return false;
      }
      return true;
    })
  });
}

module.exports = {
  getData,
};