const express = require('express');
const UsersController = require('./users.controllers');
const { authorize } = require('./middelwares/authorize');

const userRouter = express.Router();

userRouter.post(
  '/auth/register',
  UsersController.validateUserCredentials,
  UsersController.createUser,
);

userRouter.post(
  '/auth/login',
  UsersController.validateUserCredentials,
  UsersController.login,
);

userRouter.delete(
    '/auth/logout',
    authorize,
    UsersController.logout,
);

userRouter.get(
    '/users/current',
    authorize,
    UsersController.currentUser,
)

userRouter.patch(
  '/users',
  authorize,
  UsersController.validateUpdateUser,
  UsersController.updateUser,
)

module.exports = userRouter;
