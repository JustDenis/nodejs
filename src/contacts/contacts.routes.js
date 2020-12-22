const express = require('express');
const ContactsController = require('./contacts.controllers');

const contactsRouter = express.Router();

contactsRouter.get('/', ContactsController.getContacts);

contactsRouter.get('/:id', ContactsController.getContactById);

contactsRouter.post(
  '/',
  ContactsController.validateCreateContact,
  ContactsController.addContact,
);

contactsRouter.delete('/:id', ContactsController.removeContact);

contactsRouter.patch(
  '/:id',
  ContactsController.validatePatchUser,
  ContactsController.patchContact,
);

module.exports = contactsRouter;
