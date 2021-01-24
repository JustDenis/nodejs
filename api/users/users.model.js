const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const { Schema } = mongoose;
const { UnauthorizedError } = require('../helpers/errors.constructors');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true,},
  avatarUrl: {type: String, required: true},
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: { type: String, default: '', },
});

userSchema.statics.findUserByEmail = findUserByEmail;
userSchema.statics.verifyToken = verifyToken;
userSchema.statics.hashPassword = hashPassword;
userSchema.methods.checkUser = checkUser;
userSchema.methods.updateToken = updateToken;

async function findUserByEmail(email) {
    return this.findOne({email});
}

async function updateToken(newToken) {
  return userModel.findByIdAndUpdate(this._id, {
    token: newToken,
  });
}

function verifyToken (token) {
  const result = jwt.verify(token, process.env.JWT_SECRET);
  return result;
}

function hashPassword (password) {
  return bcryptjs.hash(password, 4);
}

async function checkUser(password) {
  const isPasswordValid = await bcryptjs.compare(password, this.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Email or password is wrong');
  }

  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: 2 * 24 * 60 * 60,
  });

  await this.updateToken(token);

  return token;
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
