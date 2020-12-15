const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const contactsUtils = require('../contactsUtils');

const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, '../', 'db', 'contacts.json');

class ContactsController {
  async getContacts(_, res) {
    const contacts = await contactsUtils.listContacts();

    res.status(200).json(contacts);
  }

  async getContactById(req, res) {
    const contactId = parseInt(req.params.id);
    const foundContact = await contactsUtils.getContactById(contactId);

    res.status(200).json(foundContact);
  }

  async addContact(req, res) {
    const newContactList = await contactsUtils.addContact(req.body);

    res.status(201).json(newContactList);
  }

  async removeContact(req, res) {
    const contactId = parseInt(req.params.id);
    const contacts = await contactsUtils.listContacts();

    const foundContactIndex = contacts.findIndex(
      contact => contact.id === contactId,
    );
    if (foundContactIndex === -1) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    contactsUtils.removeContact(contactId);

    res.status(200).json({ message: 'Contact deleted' });
  }

  async patchContact(req, res) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: 'missing fields' });
      return;
    }

    const contactId = parseInt(req.params.id) - 1;
    const contacts = await contactsUtils.listContacts();

    if (!contacts[contactId]) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    const patchedContact = (contacts[contactId] = {
      ...contacts[contactId],
      ...req.body,
    });

    const newContactsToJson = JSON.stringify(contacts);
    await fsPromises.writeFile(contactsPath, newContactsToJson);

    res.status(200).json(patchedContact);
  }

  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      number: Joi.string().required(),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    next();
  }

  validatePatchUser(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      number: Joi.string(),
    });

    const result = createContactRules.validate(req.body);

    if (result.error) {
      res.status(400).json({ message: result.error.details[0].message });
      return;
    }

    next();
  }
}

module.exports = new ContactsController();
