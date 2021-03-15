const mongoose = require('mongoose'),
config = require('../../config/client.json');

module.exports = mongoose.model('Guild', new mongoose.Schema({
  id: {
    type: String
  },
  registeredAt: {
    type: Number,
    default: Date.now()
  },
  prefix: {
    type: String,
    default: config.prefix
  },

}))
