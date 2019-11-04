'use strict';

var {getDates, getWholeWeek, getDateWithoutTime, getCurrentMeal} = require('../helpers/date-helper.js');

module.exports = function(Order) {

  Order.getAttendance = async(date, hour, minute) => {
    const Meal = Order.app.models.Meal;
    const currentMeal = await getCurrentMeal(Meal, hour, minute);
    const meals = await Meal.find();

    console.log(date);

    const orders = await Order.find({
      include: ['userMenu', 'menu'],
      where: {
        attendance: true
      }
    });

    const selectedOrders = orders.filter(order => {
      return order.menu()
      && order.menu().meal()
      && order.userMenu()
      && order.userMenu().date.getTime() == date.getTime();
    });

    const attendancePerMeal = meals.reduce((accumulator, meal) => {
      accumulator[meal.code] = selectedOrders.filter(order => {
        return order.menu().meal().code === meal.code}
      ).length;
      return accumulator;
    }, {});

    return {
      attendance: attendancePerMeal,
      selected: currentMeal
    }
  }

  Order.attendance = async (token, date, hour, minute) => {
    const Meal = Order.app.models.Meal;
    const AppUser = Order.app.models.AppUser;

    const today = new Date(getDateWithoutTime(date));
    try {
      const meal = await getCurrentMeal(Meal, hour, minute);

      if (!meal) {
        return {
          status: 'ERROR',
          message: 'Hora invalida para marcar'
        };
      }

      const user = await AppUser.findOne({
        where: {
          qrCode: token
        }
      });

      if (!user) {
        return {
          status: 'ERROR',
          message: 'No se reconoce el usuario'
        };
      }

      const orders = await Order.find({
        include: ['userMenu', 'menu']
      });

      const selectedOrders = orders.filter(order => {
        return order.menu()
        && order.menu().meal()
        && order.userMenu()
        && order.menu().meal().code == meal.code
        && order.userMenu().date.getTime() == today.getTime()
        && order.userMenu().userId.equals(user.id);
      });

      if (!selectedOrders.length) {
        return {
          status: 'ERROR',
          message: 'El usuario no tiene menu asignado'
        };
      }

      const approvedOrders = selectedOrders.filter(order => {
        return order.userMenu().status === 'APPROVED';
      });

      if (!approvedOrders.length) {
        return {
          status: 'ERROR',
          message: 'El menu asignado no esta Aprobado'
        };
      }

      approvedOrders.forEach(order => {
        order.updateAttribute('attendance', true, (err, instance) => {
          if (err) throw err;
        });
      });

      const total = orders.filter(order => order.attendance).length;

      const result = {
        attendance: total,
        date: today,
        meal: meal,
        updated: approvedOrders.length,
        user: user,
        status: 'SUCCESS',
        message: 'Asistencia marcada correctamente'
      }

      return result;
   } catch(error) {
     throw error;
   }
  };

  Order.tempAttendance = async (qrCode, date, hour, minute) => {
    const Meal = Order.app.models.Meal;
    const AppUser = Order.app.models.AppUser;

    try {
      const today = new Date(getDateWithoutTime(date));
      const meal = await getCurrentMeal(Meal, hour, minute);

      if (!meal) {
        return {
          status: 'ERROR',
          message: 'Hora invalida para marcar'
        };
      }

      const user = await AppUser.findOne({
        where: {
          qrCode: qrCode
        }
      });

      if (!user) {
        return {
          status: 'ERROR',
          message: 'No se reconoce el usuario'
        };
      }

      const orders = await Order.find({
        include: ['userMenu', 'menu']
      });

      const selectedOrders = orders.filter(order => {
        return order.menu()
        && order.menu().meal()
        && order.userMenu()
        && order.menu().meal().code == meal.code 
        && order.userMenu().date.getTime() == today.getTime()
        && order.userMenu().userId.equals(user.id);
      });

      if (!selectedOrders.length) {
        return {
          status: 'ERROR',
          message: 'El usuario no tiene menu asignado'
        };
      }

      const approvedOrders = selectedOrders.filter(order => {
        return order.userMenu().status === 'APPROVED';
      });

      if (!approvedOrders.length) {
        return {
          status: 'ERROR',
          message: 'El menu asignado no esta Aprobado'
        };
      }

      approvedOrders.forEach(order => {
        order.updateAttribute('attendance', true, (err, instance) => {
          if (err) throw err;
        });
      });

      const total = orders.filter(order => order.attendance).length;

      const result = {
        attendance: total,
        date: today,
        meal: meal,
        updated: approvedOrders.length,
        user: user,
        status: 'SUCCESS',
        message: 'Asistencia marcada correctamente'
      }

      return result;
   } catch(error) {
     throw error;
   }
  };

  Order.generateCodes = async (quantity, size) => {
    if (!size) size = 500;
    const list = [];
    const AccessToken = Order.app.models.AccessToken;

    for (var i=0; i<quantity; i++) {
      var token = await new Promise((resolve, reject) => {
        AccessToken.createAccessTokenId(async (error, token) => {
          if (error) reject(error);
          resolve(token);
        });
      });
      list.push({
        token: token,
        image: `https://api.qrserver.com/v1/create-qr-code/?margin=40&size=${size}x${size}&data=${token}`
      });
    }

    return list;
  }

  Order.currentMeal = (callback) => {
    const Meal = Order.app.models.Meal;
    const today = new Date();
    const meal = getCurrentMeal(Meal, today);

    meal.then(meal=> {
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
      {
        arg: 'date',
        type: 'date',
        required: true,
        http: {
          source: 'form',
        },
      },
      {
        arg: 'hour',
        type: 'number',
        required: true,
        http: {
          source: 'form',
        },
      },
      {
        arg: 'minute',
        type: 'number',
        required: true,
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

  Order.remoteMethod('tempAttendance', {
    http: {
      path: '/TempAttendance',
      verb: 'post',
    },
    accepts: [
      {
        arg: 'qrCode',
        type: 'String',
        required: true,
        description: 'The code QR that is required for authentication',
        http: {
          source: 'form',
        },
      },
      {
        arg: 'date',
        type: 'date',
        required: true,
        http: {
          source: 'form',
        },
      },
      {
        arg: 'hour',
        type: 'number',
        required: true,
        http: {
          source: 'form',
        },
      },
      {
        arg: 'minute',
        type: 'number',
        required: true,
        http: {
          source: 'form',
        },
      }
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

  Order.remoteMethod('getAttendance', {
    http: {
      path: '/Attendance',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'date',
        type: 'date',
        required: true,
      },
      {
        arg: 'hour',
        type: 'number',
        required: true,
      },
      {
        arg: 'minute',
        type: 'number',
        required: true,
      }
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });

  Order.remoteMethod('generateCodes', {
    http: {
      path: '/GenerateCodes',
      verb: 'get',
    },
    accepts: [
      {
        arg: 'quantity',
        type: 'number',
        required: true,
      },
      {
        arg: 'size',
        type: 'number',
        required: false,
      }
    ],
    returns: {
      arg: 'result',
      type: 'object',
    },
  });

};
