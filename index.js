const contactOperations = require('./contacts.js');
const yargs = require('yargs');
const argv = yargs
  .number('id')
  .string('action')
  .string('name')
  .string('email')
  .string('phone')
  .argv;

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case 'list':
      contactOperations.listContacts();
      break;

    case 'get':
      contactOperations.getContactById(id);
      break;

    case 'add':
      contactOperations.addContact(name, email, phone);
      break;

    case 'remove':
      contactOperations.removeContact(id);
      break;

    default:
      console.warn('\x1B[31m Unknown action type!');
  }
}

invokeAction(argv);
