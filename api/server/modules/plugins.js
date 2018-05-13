'use strict';

const   MySwagger = require('./swagger'),
        Inert = require('inert'),
        Vision = require('vision'),
        MySequelize = require ('./sequelize'),
        User_list = require('./user-list'),
        Auth_basic = require('./auth-basic'),
        Auth_jwt = require('./auth-jwt'),
        Jwt_login = require('./jwt-login');
// auth stratégy has to be register before other routes plugins... for admin scope 
module.exports = [MySwagger, Inert, Vision, MySequelize, Auth_jwt, User_list, Jwt_login];