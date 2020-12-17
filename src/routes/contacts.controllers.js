const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const contactsUtils = require('../contactsUtils');

const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, '../', 'db', 'contacts.json');

class ContactsController {
  async getContacts(_, res) {
    const contacts = await contactsUtils.listContacts();

    res.status(200).send(contacts);
  }

  async getContactById(req, res) {
    const contactId = parseInt(req.params.id);
    const foundContact = await contactsUtils.getContactById(contactId);

    if (!foundContact) {
      return res.status(404).send({ message: 'Contact not found' });
    }

    res.status(200).send(foundContact);
  }

  async addContact(req, res) {
    const newContactList = await contactsUtils.addContact(req.body);

    res.status(201).send(newContactList);
  }

  async removeContact(req, res) {
    const contactId = parseInt(req.params.id);
    const contact = await contactsUtils.getContactById(contactId);

    if (!contact) {
      res.status(404).send({ message: 'Contact not found' });
      return;
    }

    contactsUtils.removeContact(contactId);

    res.status(200).send({ message: 'Contact deleted' });
  }

  async patchContact(req, res) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).send({ message: 'missing fields' });
      return;
    }

    const contactId = parseInt(req.params.id);
    const contact = await contactsUtils.getContactById(contactId);

    if (!contact) {
      res.status(404).send({ message: 'Contact not found' });
      return;
    }

    const patchedContact = await contactsUtils.updateContact(
      contactId,
      req.body,
    );

    res.status(200).send(patchedContact);
  }

  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.string().email().min(1).required(),
      number: Joi.string().min(4).required(),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }

    next();
  }

  validatePatchUser(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(1),
      email: Joi.string().email().min(1),
      number: Joi.string().min(4),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      res.status(400).send({ message: result.error.details[0].message });
      return;
    }

    next();
  }
}

module.exports = new ContactsController();
