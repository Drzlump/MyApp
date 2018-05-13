'use strict';
  
module.exports = function(sequelize, DataTypes) {
  const Book = sequelize.define('Book', {
      name: DataTypes.STRING,
      style: DataTypes.STRING,
  });

  console.log('Book model define');

  return Book;
  }
