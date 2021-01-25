const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../users.model');

class UsersController {
  async currentUser(req, res, next) {
    try {
      const { email, subscription } = req.user;
      return res.status(200).send({ email, subscription });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const jwtPayload = jwt.decode(req.user.token, { complete: true }).payload;
      const updatedUser = await userModel.findByIdAndUpdate(
        jwtPayload.id,
        {
          $set: req.body,
        },
        {
          new: true,
        },
      );

      return res.status(200).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req, res, next) {

    const {filename} = req.file;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        $set: {avatarUrl: `http://localhost:${process.env.PORT}/images/${filename}`},
      },
      {
        new: true,
      },
    );
    return res.status(200).send({avatarUrl: updatedUser.avatarUrl});
  }

  validateUpdateUser(req, res, next) {
    const createContactRules = Joi.object({
      email: Joi.string().email().min(1),
      password: Joi.string().min(8),
      subscription: Joi.string().valid('free', 'pro', 'premium'),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }

    next();
  }
}

module.exports = new UsersController();
