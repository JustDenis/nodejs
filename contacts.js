const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join(__dirname, './db/contacts.json');

// TODO: задокументировать каждую функцию
async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');

  console.table(data);
}

async function getContactById(contactId) {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');
  const parsedUsers = JSON.parse(data);

  console.table(parsedUsers.find(user => user.id === contactId));
}

async function removeContact(contactId) {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');
  const parsedUsers = JSON.parse(data);
  const filteredUsers = parsedUsers.filter(user => user.id !== contactId);
  const newUsersToString = JSON.stringify(filteredUsers);

  await fsPromises.writeFile(contactsPath, newUsersToString);
}

async function addContact(name, email, phone) {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');
  const parsedUsers = JSON.parse(data);
  const usersDataLength = parsedUsers.length;
  const newContact = {
    id: usersDataLength + 1,
    name,
    email,
    phone,
  };
  const newContacts = [...parsedUsers, newContact];
  const newContactsToString = JSON.stringify(newContacts);

  await fsPromises.writeFile(contactsPath, newContactsToString);
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};
