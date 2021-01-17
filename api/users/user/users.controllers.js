const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('../users.model');

class UsersController {
  async currentUser(req, res, next) {
    try {
      const { _id, email, subscription } = req.user;
      return res.status(200).send({ id: _id, email, subscription });
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

      console.log(updatedUser);

      return res.status(200).send(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  validateUpdateUser(req, res, next) {
    const createContactRules = Joi.object({
      email: Joi.string().email().min(1),
      password: Joi.string().email().min(8),
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
