'use strict';

module.exports = function(UserMenu) {
  UserMenu.getMenuPerDate = function(callback) {

  };

  UserMenu.remoteMethod('menu-per-date', {
    http: {
      path: '/menus-per-date',
      verb: 'get',
    },
    returns: {
      
    },
  });
};
