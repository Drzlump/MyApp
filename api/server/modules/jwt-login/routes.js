'use strict';

const Handler = require ('./handlers'),
      joi = require('joi');

const Routes = [
  {
    method: 'POST',
    path: '/v1/login',
    options: {
      handler: Handler.myHandler.login,
      description: 'login to the apllication',
      auth: false,
      tags: ['api','login'],
      validate: {
        payload: {
            username: joi
              .string()
              .required()
              .description('Your user name')
              .example('John')
              .min(3)
              .max(30),
            password: joi
              .string()
              .required()
              .description('Your password')
              .min(5)
              .max(30)
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/v1/logout',
    options: {
      handler: Handler.myHandler.logout,
      description: 'logout to the apllication',
      tags: ['api','login'],
      validate: {
        headers: joi.authHeader(1, 500)
      }
    }
  },
  {
    method: 'POST',
    path: '/v1/token',
    options: {
      handler: Handler.myHandler.token,
      description: 'trade refresh token for à new access token',
      auth: false,
      tags: ['api','login'],
      validate: {
        headers: joi.authHeader(1, 500)
      }
    }
  },
  {
    method: 'POST',
    path: '/v1/refreshToken',
    options: {
      handler: Handler.myHandler.refreshToken,
      description: `Trade refresh token for a new resfresh token (Only avaible in the last 5 mins of the token life)`,
      auth: false,
      tags: ['api','login'],
      validate: {
        headers: joi.authHeader(1, 500)
      }
    }
  }
]

module.exports = Routes;
