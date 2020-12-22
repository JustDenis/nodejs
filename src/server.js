const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./contacts/contacts.routes');
const mongoose = require('mongoose');
require('dotenv').config();

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
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors({ origin: 'http://localhost:3000' }));
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
