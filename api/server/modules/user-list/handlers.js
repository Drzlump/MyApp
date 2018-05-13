'use strict'

const joi = require('joi'),
      boom = require('boom'),
      seq = require('sequelize'),
      bcrypt = require('bcryptjs');

const saltRounds = 10;


const myHandler = {
  user_list: async function  (request, h) {
    const fab_db = request.getDb('fab_db');
    const User = fab_db.sequelize.models.User;
    try {
      let users = await User.findAll();
      return users;
    }
    catch(err){ 
      return boom.badImplementation(err);
    }
  },
  user_post: async function  (request, h) {
    const fab_db = request.getDb('fab_db');
    const User = fab_db.sequelize.models.User;
    const { name, pass } = request.payload;
    //User.build({name: name , pass: pass});
    try{
      let user = await User.findOne({where: {name: name}});
      if(user){ 
        
        return boom.conflict(`User: ${user.dataValues.name} alredy exist`);
      }
      else{
        bcrypt.hash(pass, saltRounds, (err, hash) =>{
          if (err) {
            console.log(err); 
          }
          User.create({name: name, pass: hash, scope: 'user', refreshKey: ''});
        });
        const response = h.response('User created').code(201);
        return response;
      }
    }
    catch(err){
      return boom.badImplementation(err);
    }
  },
  user_delete: async function(request,h) {
    const fab_db = request.getDb('fab_db');
    const User = fab_db.sequelize.models.User;
    const id = request.payload.id;
    try{
      let user = await User.findOne({where: {id: id}});
      if(user){ // le user existe --> delete
        user.destroy({});
        const response = h.response('User deleted').code(200);
        return response;
      }
      else{ 
        return boom.notFound(`No User with id : ${id}`);
      } 
    }
    catch(err){
      return boom.badImplementation(err);
    }
  }
}

const schema = {
  user_list: joi
  .string() 
};

module.exports = {
  myHandler,
  schema
};