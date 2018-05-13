'use strict';

const Routes = require('./routes'),
      Sequelize = require('sequelize'),
      fs = require('fs');

module.exports = {
  name: 'user-list',
  version: '1.0.0',

  register: async (server, options) => {
    
    server.dependency([ 'hapi-sequelizejs' ]);
    //Add db-models linked to this plugin into the db
    //has to be done before cause of plugin dependency problem
    const fab_db = server.plugins['hapi-sequelizejs']['fab_db'];
    fs.readdir(`${__dirname}/models/`, (err, items) => {
      for (var i=0; i<items.length; i++) {
          //console.log(items[i]);
          let model = fab_db.sequelize.import(`${__dirname}/models/${items[i]}`);
          //console.log(`${__dirname}/models/${items[i]}`);
          model.sync();
      }
    });
   
    server.route(Routes);
    server.log('info', 'Plugin registrered: user-list');
    //console.log(options); objet options passé au moment de register le plugin depuis le serveur


  }
};