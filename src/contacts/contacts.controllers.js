const Joi = require('joi');
const fs = require('fs');
const path = require('path');

const { promises: fsPromises } = fs;
const contactsPath = path.join(__dirname, '../', 'db', 'contacts.json');

class ContactsController {
  async getContacts(_, res) {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');

    res.status(200).send(contacts);
  }

  async getContactById(req, res) {
    const contactId = parseInt(req.params.id);
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContacts = JSON.parse(contacts);

    const foundContact = parsedContacts.find(
      contact => contact.id === contactId,
    );

    res.status(200).json(foundContact);
  }

  async addContact(req, res) {
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContacts = JSON.parse(contacts);
    let lastId = 0;
    parsedContacts.forEach(item => {
      if (item.id > lastId) {
        lastId = item.id;
      }
    });

    const contact = req.body;

    const finalContact = {
      id: lastId + 1,
      ...contact,
    };
    const newContacts = [...parsedContacts, finalContact];
    const newContactsToJson = JSON.stringify(newContacts);

    await fsPromises.writeFile(contactsPath, newContactsToJson);

    res.status(201).json(finalContact);
  }

  async removeContact(req, res) {
    const contactId = parseInt(req.params.id);
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContacts = JSON.parse(contacts);

    const foundContactIndex = parsedContacts.findIndex(
      contact => contact.id === contactId,
    );
    if (foundContactIndex === -1) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    const newContacts = parsedContacts.filter(
      contact => contact.id !== contactId,
    );
    const newContactsToJson = JSON.stringify(newContacts);
    await fsPromises.writeFile(contactsPath, newContactsToJson);

    res.status(200).json({ message: 'Contact deleted' });
  }

  async patchContact(req, res) {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({ message: 'missing fields' });
      return;
    }

    const contactId = parseInt(req.params.id) - 1;
    const contacts = await fsPromises.readFile(contactsPath, 'utf-8');
    const parsedContacts = JSON.parse(contacts);

    if (!parsedContacts[contactId]) {
      res.status(404).json({ message: 'Contact not found' });
      return;
    }

    const patchedContact = (parsedContacts[contactId] = {
      ...parsedContacts[contactId],
      ...req.body,
    });

    const newContactsToJson = JSON.stringify(parsedContacts);
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
