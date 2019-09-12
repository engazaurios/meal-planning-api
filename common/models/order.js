'use strict';

var {getDates, getWholeWeek, getDateWithoutTime, getCurrentMeal} = require('../helpers/date-helper.js');

module.exports = function(Order) {

  Order.attendance = (token, callback) => {
    const AccessToken = Order.app.models.AccessToken;
    const UserMenu = Order.app.models.UserMenu;
    const today = new Date(getDateWithoutTime(new Date()));
    const currentMeal = getCurrentMeal();

    AccessToken.resolve(token, (error, token) => {
      if (error || !token) {
        callback('Invalid parameters');
        return;
      }
      Order.find({
        include: ['userMenu', 'menu']
      }).then(orders=> {

        const selectedOrders = orders.filter(order => {
          return order.menu()
          && order.menu().meal()
          && order.userMenu()
          && order.menu().meal().code == currentMeal 
          && order.userMenu().date.getTime() == today.getTime()
          && order.userMenu().userId.equals(token.userId);
        });

        selectedOrders.forEach(order => {
          order.updateAttribute('attendance', true, (err, instance) => {
            if (err) callback(err);
          });
        });

        const total = orders.filter(order => order.attendance).length;

        const result = {
          attendance: total,
          date: today,
          meal: currentMeal,
          updated: selectedOrders.length,
          accessToken: token
        }

        callback(null, result);
      }).catch(error => {
        callback(error);
      });
    })
  };

  Order.currentMeal = (callback) => {
    const Meal = Order.app.models.Meal;
    const mealCode = getCurrentMeal();

    Meal.findOne({code: mealCode})
    .then(meal=> {
      callback(null, meal);
    }).catch(error=>{
      callback(error);
    });
  };

  Order.remoteMethod('attendance', {
    http: {
      path: '/Attendance',
      verb: 'post',
    },
    accepts: [
      {
        arg: 'token',
        type: 'String',
        required: true,
        description: 'The token to check',
        http: {
          source: 'form',
        },
      },
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });

  Order.remoteMethod('currentMeal', {
    http: {
      path: '/CurrentMeal',
      verb: 'get',
    },
    accepts: [],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });

};
