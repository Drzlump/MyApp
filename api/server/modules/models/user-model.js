'use strict';
  
module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
      name: DataTypes.STRING,
      pass: DataTypes.STRING,
      scope: DataTypes.STRING,
      refreshKey: DataTypes.STRING
  });

  console.log('User model define');

  return User;
  }

