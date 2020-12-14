const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactsRouter = require('./contacts/contacts.routes');
require('dotenv').config();

module.exports = class ContactsServer {
  constructor() {
    this.server = null;
  }

  start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initRoutes(){
    this.server.use('/contacts', contactsRouter);
  }

  initMiddlewares() {
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors({ origin: 'http://localhost:3000' }));
  }

  startListening() {
    this.server.listen(process.env.PORT, () => {
      console.log(`Server started listening on port ${process.env.PORT}`);
    });
  }
};
