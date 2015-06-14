// grab the mongoose module
var mongoose = require('mongoose');

var containerSchema = new mongoose.Schema({
  title: String,
  location: String,
  start_date: Date,
  end_date: Date,  
  start_date_pretty: String,
  end_date_pretty: String,
  link: String,
  publisher: String,
  tags: [String]
});

module.exports = mongoose.model('container', containerSchema);