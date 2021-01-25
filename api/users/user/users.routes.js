const express = require('express');
const UsersController = require('./users.controllers');
const authorize = require('../../middelwares/authorize');
const minifyImage = require('../../middelwares/minify.image');
const upload = require('../../helpers/multer.config');

const usersRouter = express.Router();

usersRouter.get('/current', authorize, UsersController.currentUser);

usersRouter.patch(
  '/avatars',
  authorize,
  upload.single('avatar'),
  minifyImage,
  UsersController.updateAvatar,
);

usersRouter.patch(
  '/',
  authorize,
  UsersController.validateUpdateUser,
  UsersController.updateUser,
);

module.exports = usersRouter;
