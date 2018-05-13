'use strict';

const Hapi = require('hapi');
const plugins = require('./modules/plugins');
const routes = require('./init/routes');

//init and start Server
const start = async (host, port) => {
  const server = new Hapi.Server({  
    host: host,
    port: port
  })
  // activer les log server.log
  server.events.on('log', (event, tags) => {
    console.log(`${event.data}`);
  });
  try { 
     //Register all Plugins
    await server.register(plugins);
  }
  catch(err){
    console.error(err);
    return err;
  }
  //Initialize routes
  server.route(routes(server));

  //Start accepting request
  try { 
    await server.start();
    //Server started successfully
    console.log(`Server started at: ${server.info.uri}`);
  }
  catch(err){
    console.error(err);
    return err;
  }
}
/*//init and start Server
const start = (host, port) => {
  return new Promise((resolve, reject) =>{
    const server = new Hapi.Server({  
      host: host,
      port: port
    })
    
    try { 
    //Register all Plugins
      
      server.register(plugins);
      //console.log(`Plugins registred`);
      
       //Initialize routes
      server.route(routes(server));

      //Start accepting request
      server.start();

      //Server started successfully
      console.log(`Server started at: ${server.info.uri}`);
      resolve();
    }
    catch (err) {  
      console.error(err);
      return reject(err);
    } 
  })
}*/
module.exports = {
  start
};
  
