'use strict'

const joi = require('joi'),
      boom = require('boom'),
      seq = require('sequelize'),
      jwt = require('jsonwebtoken'),
      bcrypt = require('bcryptjs'),
      config = require('../../../config.js'),
      randomstring = require("randomstring");

const saltRounds = 10;
const SECRET = config.ACCESS_TOKEN_SECRET;
const SECRET_2 = config.REFRESH_TOKEN_SECRET;

// createAccessToken
const createAccessTokens = async (user, secret) => {
  try
  { 
    const createAccessToken = jwt.sign(
      {
        userId: user.dataValues.id,
        name: user.dataValues.name, 
        scope: user.dataValues.scope
        //alg: HS512
      },
      secret,
      {
        expiresIn: '10m',
      },
    );
    
   return createAccessToken;
  }
  catch(err){
    return err;
  }
};

//createRefreshToken
const createRefreshTokens = async (user, secret2) => {
  try{
    let createRefreshToken = jwt.sign(
      {
        userId: user.dataValues.id,
      },
      secret2,
      {
        expiresIn: '1h',
      },
    );
    return createRefreshToken;
  }
  catch(err){
    return err;
  }
};

// createtokens fct
// attetion il peut être utile de crypter ces tokens (surtout le refresh) et de ne les envoyer que sous SSL
const createTokens = async (user, secret, secret2) => {

  const createToken = await createAccessTokens(user, secret);
  const createRefreshToken = await createRefreshTokens(user, secret2);
  
  return Promise.all([createToken, createRefreshToken]);

};

const myHandler = {
  login: async function  (request, h) {
    const fab_db = request.getDb('fab_db');
    const User = fab_db.sequelize.models.User;
    const { username, password } = request.payload;
    try {
      let user = await User.findOne({where: {name: username}});
      if(user){
        // username ok
        //check password
        const valid = await bcrypt.compare(password, user.dataValues.pass);
        if (!valid) {
          // bad password
          return boom.unauthorized('invalid password');
        }
        // password ok 
        // create resfresh key in db
        user.refreshKey = randomstring.generate(128);
        user.save();
        // create token, resfresh token is signed with the secret and the resfresh key. To revoque acces to a refresh token, just change the resfresh key.
        const [token, refreshToken] = await createTokens(user, SECRET, SECRET_2 + user.resfreshKey);
        const response = h.response({token, refreshToken})
          .code(200)
          .header('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
          .header('x-token', token)
          .header('x-refresh-token', refreshToken);
        return response;
      }
      else{
        return boom.unauthorized('invalid username');
      }
    }
    catch(err){ 
      return boom.badImplementation(err);
    }
  },
  logout: async function  (request, h) {
    const fab_db = request.getDb('fab_db');
    const User = fab_db.sequelize.models.User;
    const id = request.auth.credentials.userId;
    try{
      let user = await User.findOne({where: {id: id}});
      if(user){ 
        user.refreshKey = '';
        user.save();
        const response = h.response('You will be loged out in few secondes...')
          .code(200);
        return response;
      }
      else{
        return boom.resourceGone('Your user did not exist anymore');
      }
    }
    catch(err){
      return boom.badImplementation(err);
    }
  },
  // trade a resfresh token for à new acces token
  token: async function  (request, h) {
    //const refreshToken = req.headers['x-refresh-token'];

    // recupérer le token à partir de authorization
    let authorization = request.raw.req.headers.authorization;
    if (!authorization) {
      return boom.unauthorized('Need a valid refresh token', 'Bearer');
    }
    const [tokenType, refreshToken] = authorization.split(/\s+/);

    if (!refreshToken
        || tokenType.toLowerCase() !== 'bearer') {
          return boom.unauthorized('Need a valid refresh token', 'Bearer');
    }

    if (refreshToken.split('.').length !== 3) {
      return  boom.unauthorized('Need a valid refresh token', 'Bearer');
    }
    let decodedJWT;
    try{
      // decoder le token
      try{
        decodedJWT = jwt.decode(refreshToken);
      }
      catch(err){
        return  boom.unauthorized('Need a valid refresh token', 'Bearer');
      }
      // recupérer le user.refreshKey en db 
      const id = decodedJWT.userId;
      const fab_db = request.getDb('fab_db');
      const User = fab_db.sequelize.models.User;
      let user = await User.findOne({where: {id: id}});
      if(!user){
        return boom.resourceGone('Your user did not exist anymore'); 
      }
      // verifier le refresh token avec secret et user.refreshkey
      const refreshSecret = SECRET_2 + user.resfreshKey
      try{
        decodedJWT = jwt.verify(refreshToken, refreshSecret);
      }
      catch(err){
        return  boom.unauthorized('Need a valid refresh token', 'Bearer');
      }
      // cree nouveau access token 
      const newAccessToken = await createAccessTokens(user, SECRET);
      // renvoyer old refresh token et new acess token 
      const response = h.response({newAccessToken, refreshToken})
        .code(200)
        .header('Access-Control-Expose-Headers', 'x-token, x-refresh-token')
        .header('x-token', newAccessToken)
        .header('x-refresh-token', refreshToken);
      return response;
    }
    catch(err){
      return boom.badImplementation(err);
    }
  },
  // trade a resfresh token for à new refreshToken token
  refreshToken: async function  (request, h) {
    //const refreshToken = req.headers['x-refresh-token'];

    // recupérer le token à partir de authorization
    let authorization = request.raw.req.headers.authorization;
    if (!authorization) {
      return boom.unauthorized('Need a valid refresh token', 'Bearer');
    }
    const [tokenType, refreshToken] = authorization.split(/\s+/);

    if (!refreshToken
        || tokenType.toLowerCase() !== 'bearer') {
          return boom.unauthorized('Need a valid refresh token', 'Bearer');
    }

    if (refreshToken.split('.').length !== 3) {
      return  boom.unauthorized('Need a valid refresh token', 'Bearer');
    }
    let decodedJWT;
    try{
      // decoder le token
      try{
        decodedJWT = jwt.decode(refreshToken);
        console.log(decodedJWT)
      }
      catch(err){
        return  boom.unauthorized('Need a valid refresh token', 'Bearer');
      }
      // recupérer le user.refreshKey en db 
      const id = decodedJWT.userId;
      const fab_db = request.getDb('fab_db');
      const User = fab_db.sequelize.models.User;
      let user = await User.findOne({where: {id: id}});
      if(!user){
        return boom.resourceGone('Your user did not exist anymore'); 
      }
      // verifier le refresh token avec secret et user.refreshkey
      const refreshSecret = SECRET_2 + user.resfreshKey
      try{
        decodedJWT = jwt.verify(refreshToken, refreshSecret);
      }
      catch(err){
        return  boom.unauthorized('Need a valid refresh token', 'Bearer');
      }
      //verifier la durée de vie du resfresh token si dans 5 dernièere minutes renvoyer un nouveau sinon envoyer chi...
      let now = Date.now()/1000;
      let dureeVieToken = decodedJWT.exp - now;
      console.log('exp ' + decodedJWT.exp);
      console.log('now ' + now);
      if(dureeVieToken < 0 || dureeVieToken > 300){
        console.log(`durée de vie: ${[dureeVieToken]}`);
        return  boom.unauthorized('resfrehsw token has to exipire in 5 min to be renew...', 'Bearer');
      }
      // cree nouveau refresh token et invalide l'ancien en stockant une nouvelles clef de vérification ds le user.
      user.refreshKey = randomstring.generate(128);
      user.save();
      const newRefreshToken = await createRefreshTokens(user, SECRET_2 + user.resfreshKey);

      // renvoyer  new refresh token 
      const response = h.response({newRefreshToken})
        .code(200)
        .header('Access-Control-Expose-Headers', 'x-refresh-token')
        .header('x-refresh-token', newRefreshToken);
      return response;
    }
    catch(err){
      return boom.badImplementation(err);
    }
  }
}

const schema = {

};

module.exports = {
  myHandler,
  schema
};