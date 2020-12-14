const fs = require('fs');
const { promises: fsPromises } = fs;
const path = require('path');

const contactsPath = path.join(__dirname, 'db', 'contacts.json');

// TODO: задокументировать каждую функцию
async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, 'utf-8');
  
  const parsedData = JSON.parse(data);

  console.table(parsedData);
  return parsedData;
}

async function getContactById(contactId) {
  const data = await listContacts();

  const foundUser = data.find(user => user.id === contactId);

  console.table(foundUser);
  return foundUser;
}

async function removeContact(contactId) {
  const data = await listContacts();
  const filteredUsers = data.filter(user => user.id !== contactId);
  const newUsersToString = JSON.stringify(filteredUsers);

  await fsPromises.writeFile(contactsPath, newUsersToString);
}

async function addContact(name, email, phone) {
  const data = await listContacts();
  let lastId = 0;
  data.forEach(item => {
    if(item.id > lastId){
      lastId = item.id
    }
  });

  const newContact = {
    id: lastId + 1,
    name,
    email,
    phone,
  };

  const newContacts = [...data, newContact];
  const newContactsToString = JSON.stringify(newContacts);

  await fsPromises.writeFile(contactsPath, newContactsToString);

  const listWithNewUser = await listContacts();
  return listWithNewUser;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact
};
