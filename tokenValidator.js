const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const { headers: { authorization } } = req;
  if(authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const localAuth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    session: false,
    getToken: getTokenFromHeaders,
  }),
};

module.exports = localAuth;