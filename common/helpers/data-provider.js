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
  .then(userMenus => {
    return new Promise((resolve, reject) => {
      // Filter by cost center.
      const filteredResult = userMenus.filter(userMenu => {
        if (!userMenu.user() || !userMenu.user().costCenter()) {
          return false;
        }

        if (costCenters.length && !costCenters.includes(userMenu.user().costCenterId.toString())) {
          return false;
        }

        return true;
      });

      const userMenusTuples = filteredResult.reduce((carry, userMenu) => {
        userMenu.menus().forEach((menu) => {
          carry.push({ userMenuId: userMenu.id, menuId: menu.id });
        });

        return carry;
      }, []);

      // Find orders related to user menus.
      async.map(
        userMenusTuples,
        (tuple, callback) => Order.findOne({
          where: {
            menuId: tuple.menuId,
            userMenuId: tuple.userMenuId
          }
        }, callback),
        (err, relatedOrders) => {
          if (err) {
            return reject(errr);
          }

          return resolve({
            userMenus: filteredResult,
            orders: relatedOrders
          });
        }
      );
    })
  });
}

module.exports = {
  getData,
};
