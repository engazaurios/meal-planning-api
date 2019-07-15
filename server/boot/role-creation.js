module.exports = function roleCreation(app) {
  var AppUser = app.models.AppUser;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;

  // Role.destroyAll({}, function() {
  //   AppUser.destroyAll({}, function() {
  //     createUsers();
  //   });
  // });

  function createUsers() {
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
  }
};
