'use strict';

const Now_auth = require('@now-ims/hapi-now-auth'),
      config = require('../../../config.js');
      
module.exports = {
  name: 'auth-jwt',
  version: '1.0.0',

  register: async (server, options) => {
    
    try { 
      //Register all Plugins
      await server.register([Now_auth]);
      server.dependency([ 'hapi-sequelizejs' ]);
    }
    catch(err){
      console.error(err);
      return err;
    }

    const validate = async (request, token, h) => {

      let isValid, artifacts;
      console.log(token);

      /** 
       * we asked the plugin to verify the JWT
       * we will get back the decodedJWT as token.decodedJWT 
       * and we will get the JWT as token.token
       */

      const credentials = token.decodedJWT;

      /**
       * Validate your token here
       * no validation requested here so 
       */
      isValid = true;
      
      return { isValid, credentials, artifacts }
    }

    //Authentication options
    server.auth.strategy('jwt-strategy', 'hapi-now-auth', { 
      verifyJWT: true,
      keychain: [config.ACCESS_TOKEN_SECRET],
      validate: validate });
    server.auth.default('jwt-strategy');
    server.log('info', 'Plugin registrered: auth-jwt');
    //console.log(options); objet options passé au moment de register le plugin depuis le serveur
  }
};