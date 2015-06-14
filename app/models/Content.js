// grab the mongoose module
var mongoose = require('mongoose');
var random = require('mongoose-random');

var contentSchema = new mongoose.Schema({
  text: {
    title: String,
    author: String,
    body: String,
    file: String
  },
  image: {
    url: String,
    thumb: String,
    small: String,
    large: String,
  },
  date: Date,
  user: String,
  public: Boolean,
  tags: [String],
  exhibition: [String],
  publication: [String] 
});

module.exports = mongoose.model('cw_Content', contentSchema);