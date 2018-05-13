'use strict';
const Routes = require('./routes');

module.exports = {
  name: 'jwt-login',
  version: '1.0.0',

  register: async (server, options) => {
    
    //Créer model en db ou depandant d'un autre modules qui créer les models
    server.dependency(['hapi-sequelizejs']);
    server.route(Routes);
    server.log('info', 'Plugin registrered: jwt-login');
    //console.log(options); objet options passé au moment de register le plugin depuis le serveur
  }
};