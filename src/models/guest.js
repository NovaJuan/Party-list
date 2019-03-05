const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GuestSchema = new Schema({
    name: { type: String },
    description: { type: String },
    photoHash: { type: String },
    photoName: { type: String },
    photoPath: { type: String }
});

module.exports = mongoose.model('guest' ,GuestSchema);