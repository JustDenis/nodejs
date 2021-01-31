require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./contacts/contacts.routes');
const authRouter = require('./users/auth/auth.routes');
const usersRouter = require('./users/user/users.routes');
const mongoose = require('mongoose');

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initRoutes() {
    this.server.use('/api/contacts', contactsRouter);
    this.server.use('/api/auth', authRouter);
    this.server.use('/api/users', usersRouter);
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors({ origin: 'http://localhost:3000' }));
    this.server.use(express.static('./public'));
  }

  async initDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log('Database connection successful');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started listening on port ${process.env.PORT}`);
    });
  }
};
