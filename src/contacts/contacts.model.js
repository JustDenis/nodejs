const mongoose = require('mongoose');
const {Schema} = mongoose;

const contactSchema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  phone: {type: String, required: true},
  subscription: {type: String, required: false},
  password: {type: String, required: false},
  token: {type: String, required: false,}
});

contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(id, updateParams) {
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