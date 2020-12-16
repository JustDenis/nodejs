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

    if(!foundContact){
      return res.status(404).send({message: 'Contact not found'});
    }

    res.status(200).send(foundContact);
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

    const contactId = parseInt(req.params.id);
    const contact = await contactsUtils.getContactById(contactId);

    if (!contact) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    const patchedContact = await contactsUtils.updateContact(contactId, req.body);

    res.status(200).json(patchedContact);
  }

  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.email().min(1).required(),
      number: Joi.string().min(4).required(),
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
      name: Joi.string().min(1),
      email: Joi.email().min(1),
      number: Joi.string().min(4),
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
