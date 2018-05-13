'use strict';

const   pkg = require('../../../package.json'),
        MySequelize = require ('hapi-sequelizejs'),
        Sequelize = require('sequelize')
        config = require('../../../config.js');

module.exports = {
  plugin: MySequelize,
  options: [{
    name: 'fab_db', // identifier
    models: [`${__dirname}/models/*.js`], // paths/globs to model files
    sequelize: new Sequelize(config.DATABASE_NAME, config.DATABASE_USERNAME, config.DATABASE_PASSWORD, {dialect: 'postgres'}), // sequelize instance  
    sync: true, // sync models - default false
    forceSync: false, // force sync (drops tables) - default false  
  }]
}
  