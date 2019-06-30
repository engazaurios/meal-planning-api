/* jshint node: true */
'use strict';

module.exports = function(AppUser) {
  delete AppUser.validations.email;

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
};
