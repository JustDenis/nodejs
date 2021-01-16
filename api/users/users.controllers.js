const Joi = require('joi');
const jwt = require('jsonwebtoken');
const userModel = require('./users.model');
const { UnauthorizedError } = require('../helpers/errors.constructors');


class UsersController {

  get logout() {
    return this._logout.bind(this);
  }

  get currentUser() {
    return this._currentUser.bind(this);
  }

  async createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const exsistingUser = await userModel.findUserByEmail(email);

      if (exsistingUser) {
        return res
          .status(409)
          .send({ message: 'User with same email already exist' });
      }

      const passwordHash = await userModel.hashPassword(password);
      const {_id: id, email: userEmail, subscription, token} = await userModel.create({
        email,
        password: passwordHash,
      });

      return res.status(201).send({
        id,
        email: userEmail,
        subscription,
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError('Email or password is wrong');
      }

      const token = await user.checkUser(password);

      res.status(200).send({
        token,
        user: {
          id: user._id,
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async _logout(req, res, next) {
    try {
      const user = req.user;
      await user.updateToken('');

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async _currentUser(req, res, next) {
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
      const updatedUser =  await userModel.findByIdAndUpdate(
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

  validateUserCredentials(req, res, next) {
    const createUserRules = Joi.object({
      email: Joi.string().email().min(1).required(),
      password: Joi.string().min(8).required(),
    });

    const result = createUserRules.validate(req.body);

    if (result.error) {
      return res.status(400).send({ message: result.error.details[0].message });
    }

    next();
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
