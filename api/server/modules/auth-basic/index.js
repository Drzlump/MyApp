'use strict';

const Auth_basic = require('hapi-auth-basic'),
      boom = require('boom'),
      Bcrypt = require('bcryptjs');

module.exports = {
  name: 'auth-basic',
  version: '1.0.0',

  register: async (server, options) => {
    
    try { 
      //Register all Plugins
      await server.register([Auth_basic]);
      server.dependency([ 'hapi-auth-basic', 'hapi-sequelizejs' ]);
    }
    catch(err){
      console.error(err);
      return err;
    }

    const validate = async (request, username, password, h) => {

      /*if (username === 'help') {
          return { response: h.redirect('https://hapijs.com/help') };     // custom response
      }*/

      // init acces to db
      const fab_db = request.getDb('fab_db');
      const User = fab_db.sequelize.models.User;

      //check user exist in db
      try{
        let user = await User.findOne({where: {name: username}});
        if(user){ 
          //user exist so ckeck password 
          const isValid = await Bcrypt.compare(password, user.pass);
          const credentials = { id: user.id, name: user.name };
          console.log(`Autentication ${isValid}`);
          return { isValid, credentials };
        }
        else{
          console.log('Autentication fail');
          return { credentials: null, isValid: false };
        }
      }
      catch(err){
        return boom.badImplementation(err);
      }
    };

    //Authentication options
    server.auth.strategy('simple', 'basic', { validate });
    server.auth.default('simple');
    server.log('info', 'Plugin registrered: auth-basic');
    //console.log(options); objet options passé au moment de register le plugin depuis le serveur
  }
};