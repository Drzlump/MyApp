'use strict';

//See: https://github.com/glennjones/hapi-swagger

const   pkg = require('../../../package.json'),
        HapiSwagger = require('hapi-swagger');


module.exports = {
    plugin: HapiSwagger,
    //register: require('hapi-swagger'),
    options: {
        //basePath: '/',
        documentationPath: '/',
        jsonEditor: true,
        tags: [{
            'name': 'Test mesotronic',
            'description': 'Testing Hapi, Swagger, Etc'
        }],
        pathPrefixSize: 2,
        grouping: 'tags',
        tags: [{
            name: 'user',
            description: 'Gestion des utilisateur'
        },
        {
            name: 'login',
            description: 'Gestion de l\'authentification'
        }],
        schemes: ['https'],
        pathReplacements: [{
            replaceIn: 'all',
            pattern: /v([0-9]+)\//,
            replacement: ''
        }],
        info: {
            title: 'Test API Mesotronic documentation',
            description: `
A test API for my new job using Hapi, Swagger, etc.

To see all routes, [Clic here](/).

To see xx route only, [Click here](/?tags=xx).

To view the swagger.json, [Click here](/swagger.json).`,
            //Get the version from package.json
            version: pkg.version,
            contact: {
                name: 'Fabien Collin',
                email: 'fabiencollin@hotmail.com'
            },
            //Get the license from package.json
            license: {
                name: pkg.license
            }
        }       
    //         //This is for use of grouping together paths.  
    //         //Since each of our paths begin with `/api/v{1,2}`, 
    //         //we want to ignore those first two arguments in the path, 
    //         //since they won't help us group together resources
    //         pathPrefixSize: 2,
    //         // This is also used for grouping, though because of the line above, 
    //         //I don't believe that this line may be needed.  Seems to work with/without it.
    //         basePath: '/api/',
    //         // Also used for grouping paths together
    //         pathReplacements: [{
    //             // Replace the version in all paths
    //             replaceIn: 'groups',
    //             pattern: /v([0-9]+)\//,
    //             replacement: ''
    //         },{
    //             // This allows grouping to include plural forms of the noun to be grouped with their singular counter-part (ie `characters` in the group `character`)
    //             replaceIn: 'groups',
    //             pattern: /s$/,
    //             replacement: ''
    //         },{
    //             // Group all star wars related routes together
    //             replaceIn: 'groups',
    //             pattern: /\/(character|planet)/,
    //             replacement: '/starwars'
    //         }]
        
    }
}