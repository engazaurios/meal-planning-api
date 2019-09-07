/* jshint esversion: 6 */
'use strict';

const getData = (models, startDate, endDate, costCenters, users) => {
    const UserMenu = models.UserMenu;
    const AppUser = models.AppUser;

    return UserMenu.find({
      where: {and: [
        {date: {gte: startDate}},
        {date: {lte: endDate}},
      ]},
    }).then(userMenus => {
      const usersQuery = userMenus.map(userMenu => {
        return AppUser.findOne({
          where: {_id: userMenu.userId}
        }).then(user => {
          userMenu.user = user;
          return userMenu;
        });
      });
      return Promise.all(usersQuery);
    });
}

module.exports = {
  getData,
};