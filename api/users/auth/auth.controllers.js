const Joi = require('joi');
const userModel = require('../users.model');
const { UnauthorizedError } = require('../../helpers/errors.constructors');
const generateAvatar = require('../../utils/avatar.generator');

class AuthController {
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
      const avatar = await generateAvatar();
      const avatarUrl = `http://localhost:${process.env.PORT}/images/${avatar}`;
      const {
        email: userEmail,
        subscription,
        avatarUrl: avatarDB,
      } = await userModel.create({
        email,
        password: passwordHash,
        avatarUrl,
      });

      return res.status(201).send({
        user: {
          email: userEmail,
          subscription,
          avatarUrl: avatarDB,
        },
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

  async logout(req, res, next) {
    try {
      const user = req.user;
      await user.updateToken('');

      return res.status(204).send();
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

module.exports = new AuthController();
