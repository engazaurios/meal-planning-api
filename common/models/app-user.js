/* jshint node: true */
'use strict';

module.exports = function(AppUser) {
  delete AppUser.validations.email;

  AppUser.observe('after save', function setRoleMapping(ctx, next) {
    if (ctx.instance) {
      if (ctx.isNewInstance) {
        var RoleMapping = AppUser.app.models.RoleMapping;
        console.log(ctx.instance);
        RoleMapping.create({
          principalType: 'USER',
          principalId: ctx.instance.id,
          roleId: ctx.instance.roleId,
        }, function(err, roleMapping) {
          if (err) {
            return console.log(err);
          }
          console.log(roleMapping);
        });
      }
    }
    next();
  });

  // Add custom validator because validatesFormat with regex will return false on a null value
  var regularExpression = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  AppUser.validate('email', function(err) {
    if (!regularExpression.test(this.email) && this.email !== undefined) {
      err();
    }
  }, {
    message: 'Email format is invalid',
  });

  // Adds email uniqueness validation
  AppUser.validatesUniquenessOf('email', {
    message: 'Email already exists',
  });

  AppUser.createDefaultUsers = function() {
    var Role = AppUser.app.models.Role;
    var RoleMapping = AppUser.app.models.RoleMapping;

    Role.destroyAll({}, function() {
      AppUser.destroyAll({}, function() {
        AppUser.create([
          {
            name: 'Admin',
            username: 'admin',
            email: 'admin@test.com',
            password: 'hola',
          },
          {
            name: 'Guest',
            username: 'guest',
            email: 'guest@test.com',
            password: 'hola',
          },
          {
            name: 'Employe',
            username: 'employe',
            email: 'employe@test.com',
            password: 'hola',
          },
        ], function(err, users) {
          if (err) throw err;
    
          //create the admin role
          Role.create({
            name: 'admin',
          }, function(err, role) {
            if (err) throw err;
    
            //make bob an admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[0].id,
            }, function(err, principal) {
              if (err) throw err;
            });
          });
    
          //create the admin role
          Role.create({
            name: 'guest',
          }, function(err, role) {
            if (err) throw err;
    
            //make bob an admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[1].id,
            }, function(err, principal) {
              if (err) throw err;
            });
          });
    
          //create the admin role
          Role.create({
            name: 'employee',
          }, function(err, role) {
            if (err) throw err;
    
            //make bob an admin
            role.principals.create({
              principalType: RoleMapping.USER,
              principalId: users[2].id,
            }, function(err, principal) {
              if (err) throw err;
            });
          });
        });
      });
    });
  };

  AppUser.remoteMethod('createDefaultUsers', {
    http: {
      path: '/CreateDefaultUsers',
      verb: 'post',
    },
    returns: {
      arg: 'message',
      type: 'string',
    },
    accessScopes: [
      'read',
      'write',
    ], 
  });
};
