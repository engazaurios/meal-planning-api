/* jshint esversion: 6 */
'use strict';
var async = require('async');

const getData = (models, startDate, endDate, costCenters, users) => {
  const UserMenu = models.UserMenu;
  const AppUser = models.AppUser;
  const Order = models.Order;

  users = (users || []).filter(el => el != null);
  costCenters = (costCenters || []).filter(el => el != null);

  return UserMenu.find({
    include: 'user',
    where: {
      and: [
        { date: { gte: startDate }},
        { date: { lte: endDate }},
        { userId: (users.length) ? { inq: users } : { nin: [] }}
      ]
    },
  })
  // This horrible code is to add the 'order' attibute to each menu.
  .then(userMenus => new Promise((resolve, reject) => {
    async.each(
      userMenus,
      (userMenu, cb1) => {
        async.each(
          userMenu.menus(),
          (menu, cb2) => {
            Order.findOne({
              where: {
                menuId: menu.id,
                userMenuId: userMenu.id
              }
            }, (err, order) => {
              // Add 'order' attibute like loopback does (as a function).
              menu.order = () => (order ? order : null);

              cb2(err ? err : null);
            });
          },
          (err) => cb1(err ? err : null)
        );
      },
      (err) => {
        if (err) {
          return reject(errr);
        }

        return resolve(userMenus);
      }
    );
  }))
  .then(userMenus => {
    // Filter the included relation
    return userMenus.filter(userMenu => {
      if (!userMenu.user() || !userMenu.user().costCenter()) {
        return false;
      }

      if (costCenters.length && !costCenters.includes(userMenu.user().costCenterId.toString())) {
        return false;
      }

      return true;
    });
  });
}

module.exports = {
  getData,
};
