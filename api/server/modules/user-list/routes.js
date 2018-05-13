'use strict';

const Handler = require ('./handlers'),
      joi = require('joi');
      
joi.authHeader = require('joi-authorization-header')(joi);

const Routes = [
  {
    method: 'GET',
    path: '/v1/users',
    options: {
      handler: Handler.myHandler.user_list,
      description: 'Impression des utilisateurs',
      tags: ['api','user'],
      validate: {
        headers: joi.authHeader(1, 500)
      }
      /*response: {
        schema: Handler.schema.user_list
      }*/
    }
  },
  {
    method: 'POST',
    path: '/v1/users',
    options: {
      handler: Handler.myHandler.user_post,
      description: "création d'un utilisateur",
      //auth: false,
      auth: {
        access: {
          scope: 'admin'
        } 
      },
      tags: ['api','user'],
      validate: {
        payload: {
            name: joi
              .string()
              .required()
              .description('Your user name')
              .example('John')
              .min(3)
              .max(30),
            pass: joi
              .string()
              .required()
              .description('Your password')
              .min(5)
              .max(30)
        },
        headers: joi.authHeader(1, 500)
      }/*,
      response: {
        schema: Handler.schema.user_post
      }*/
    }
  },
  {
   method: 'DELETE',
    path: '/v1/users',
    options: {
      handler: Handler.myHandler.user_delete,
      description: "supression d'un utilisateur",
      auth: {
        access: {
          scope: 'admin'
        } 
      },
      tags: ['api','user'],
      validate: {
        payload: {
            id: joi
              .number()
              .integer()
              .required()
              .description('The ID of the User')
              .example('3')
              .min(1)
        },
        headers: joi.authHeader(1, 500)
      }/*,
      response: {
        schema: Handler.schema.user_post
      }*/
    }
  }
]

module.exports = Routes;
