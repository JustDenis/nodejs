const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true},
  subscription: {type: String},
  password: {type: String, required: true},
  token: {type: String}
});

contactSchema.statics.updateContact = updateContact;

async function updateContact(id, updateParams) {
  return this.findByIdAndUpdate(
    id,
    {
      $set: updateParams,
    },
    {
      new: true,
    }
  );
}

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;