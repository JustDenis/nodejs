const express = require('express');
const AuthController = require('./auth.controllers');
const { authorize } = require('../../middelwares/authorize');

const authRouter = express.Router();

authRouter.post(
  '/register',
  AuthController.validateUserCredentials,
  AuthController.createUser,
);

authRouter.post(
  '/login',
  AuthController.validateUserCredentials,
  AuthController.login,
);

authRouter.delete(
    '/logout',
    authorize,
    AuthController.logout,
);

module.exports = authRouter;
