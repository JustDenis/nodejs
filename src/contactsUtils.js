const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

// TODO: задокументировать каждую функцию
async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');
  const parsedData = JSON.parse(data);

  return parsedData;
}

async function getContactById(contactId) {
  const data = await listContacts();

  const foundUser = data.find(user => user.id === contactId);

  return foundUser;
}

async function removeContact(contactId) {
  const data = await listContacts();
  const filteredUsers = data.filter(user => user.id !== contactId);
  const newUsersToString = JSON.stringify(filteredUsers);

  await fsPromises.writeFile(contactsPath, newUsersToString);
}

async function addContact(contact) {
  const data = await listContacts();
  let lastId = 0;
  data.forEach(item => {
    if (item.id > lastId) {
      lastId = item.id;
    }
  });

  const newContact = {
    ...contact,
    id: lastId + 1,
  };

  const newContacts = [...data, newContact];
  const newContactsToString = JSON.stringify(newContacts);

  await fsPromises.writeFile(contactsPath, newContactsToString);

  const listWithNewUser = await listContacts();
  return listWithNewUser;
}

async function updateContact(id, data) {
  const contacts = await listContacts();

  const newContactsArray = contacts.map(contact => {
    if(contact.id === id){
      return contact = {
        ...contact,
        ...data,
      }
    }

    return contact
  });

  const newContactsToJson = JSON.stringify(newContactsArray);
  await fsPromises.writeFile(contactsPath, newContactsToJson);

  const patchedContact = await getContactById(id);

  return patchedContact;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
