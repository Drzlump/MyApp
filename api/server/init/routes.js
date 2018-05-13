'use strict';
/* TODO il peut être utile de mettre 1 route par fichier et d'importer ces fichier ici
const glob = require('glob');
glob.sync('api/star star/routes/*.js', {
    root: __dirname
  }).forEach(file => {
    const route = require(path.join(__dirname, file));
    server.route(route);
  });
ou voir handler index.js et faire la même chose ici ...
*/
const   handlers = require('../handlers'),
        joi = require('joi');

const routes = (server) => [{
    method: 'GET',
    path: '/home',
    options: {
        handler: handlers.test.getTest, 
        description: 'Une première route pour un 1er test',
        tags: ['api']
    }   
},
{
    method: 'GET',
    path: '/{number}',
    options: {
        handler: handlers.test.getDyn,
        description: 'Route dynamique avec validation des entrée',
        tags: ['api'],
        validate: {
            params: {
                number: joi
                    .number()
                    .integer()
                    .required()
                    .description('Your number')
                    .example('21')
                    .default('21')
                    //.valid(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 21)
                    .min(1)
                    .max(30)
            }
        },
        response: {
            schema: handlers.test.schema.fab
        }
    }
}];

module.exports = routes;