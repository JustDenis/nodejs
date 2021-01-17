const express = require('express');
const UsersController = require('./users.controllers');
const { authorize } = require('../../middelwares/authorize');

const usersRouter = express.Router();

usersRouter.get(
    '/current',
    authorize,
    UsersController.currentUser,
);

usersRouter.patch(
  '/',
  authorize,
  UsersController.validateUpdateUser,
  UsersController.updateUser,
);

module.exports = usersRouter;