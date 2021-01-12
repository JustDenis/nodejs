const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('./users.model');
const { UnauthorizedError } = require('../helpers/errors.constructors');

class UsersController {
  constructor() {
    this.costFactor = 4;
  }

  get createUser() {
    return this._createUser.bind(this);
  }

  get login() {
    return this._login.bind(this);
  }

  get logout() {
    return this._logout.bind(this);
  }

  get currentUser() {
    return this._currentUser.bind(this);
  }

  async _createUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const exsistingUser = await userModel.findUserByEmail(email);

      if (exsistingUser) {
        return res
          .status(409)
          .send({ message: 'User with same email already exist' });
      }

      const passwordHash = await bcryptjs.hash(password, this.costFactor);
      const user = await userModel.create({
        email,
        password: passwordHash,
      });

      return res.status(201).send({
        id: user._id,
        email: user.email,
        subscription: user.subscription,
        token: user.token,
      });
    } catch (error) {
      next(error);
    }
  }

  async _login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userModel.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError('Email or password is wrong');
      }

      const token = await this.checkUser(password, user.password, user._id);

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
      await userModel.updateToken(user._id, '');

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async _currentUser(req, res, next){
    try {
      const {_id, email, subscription} = req.user;
      return res.status(200).send({id: _id, email, subscription});
    } catch (error) {
      next(error);
    }
  }

  async checkUser(password, userPassword, id) {
    const isPasswordValid = await bcryptjs.compare(password, userPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email or password is wrong');
    }

    const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: 2 * 24 * 60 * 60,
    });

    await userModel.updateToken(id, token);

    return token;
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.substr(7);

      let userId;

      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (error) {
        return res.status(401).send({ message: 'Not authorized' });
      }

      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        return res.status(401).send({ message: 'Not authorized' });
      }

      req.user = user;
      req.token = token;

      next();
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
}

module.exports = new UsersController();
