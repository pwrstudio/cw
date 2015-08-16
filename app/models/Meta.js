/*
 *
 *  METADATA
 *
 */

var mongoose = require('mongoose');

var metaSchema = mongoose.Schema({
  title: String,
  description: String,
  email: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('meta', metaSchema);