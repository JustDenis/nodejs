const Joi = require('joi');
const contactModel = require('./contacts.model');

class ContactsController {
  async getContacts(req, res, next) {
    try {
      const { page, limit, sub } = req.query;

      if (page && limit) {
        const queryParams = sub? {subscription: sub} : {};
        const options = {
          page: Number(page),
          limit: Number(limit),
        };

        contactModel.paginate(queryParams, options, function methodName(err, result) {
          try {
            const { docs } = result;
            return res.status(200).send(docs);
          } catch (error) {
            next(err);
          }
        });
        return;
      }

      const contacts = await contactModel.find();

      return res.status(200).send(contacts);
    } catch (error) {
      next(error);
    }
  }

  async getContactById(req, res, next) {
    try {
      const contact = await contactModel.findById(req.params.id);
      console.log(contact);
      if (!contact) {
        return res.status(404).send({ message: 'Contact not found' });
      }

      return res.status(200).send(contact);
    } catch (error) {
      next(error);
    }
  }

  async addContact(req, res, next) {
    try {
      const contact = await contactModel.create({ ...req.body });

      return res.status(201).send(contact);
    } catch (error) {
      next(error);
    }
  }

  async removeContact(req, res, next) {
    try {
      const deletedContact = await contactModel.findByIdAndDelete(
        req.params.id,
      );

      if (!deletedContact) {
        return res.status(404).send({ message: `Contact not found` });
      }

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async patchContact(req, res, next) {
    try {
      const patchedContact = await contactModel.updateContact(
        req.params.id,
        req.body,
      );

      if (!patchedContact) {
        console.log(patchedContact);
        return res.status(404).send({ message: 'Contact not found' });
      }

      return res.status(200).send(patchedContact);
    } catch (error) {
      next(error);
    }
  }

  validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().min(1).required(),
      email: Joi.string().email().min(1).required(),
      phone: Joi.string().min(4).required(),
      subscription: Joi.string(),
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
      phone: Joi.string().min(4),
      subscription: Joi.string().valid('free', 'pro', 'premium'),
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
