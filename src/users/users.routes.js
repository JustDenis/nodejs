const express = require('express');
const UsersController = require('./users.controllers');

const userRouter = express.Router();

userRouter.post(
  '/register',
  UsersController.validateUserCredentials,
  UsersController.createUser,
);

userRouter.get(
  '/login',
  UsersController.validateUserCredentials,
  UsersController.login,
);

userRouter.delete(
    '/logout',
    UsersController.authorize,
    UsersController.logout,
);

userRouter.get(
    '/current',
    UsersController.authorize,
    UsersController.currentUser,
)

module.exports = userRouter;
