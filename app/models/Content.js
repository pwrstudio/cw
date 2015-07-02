var mongoose = require('mongoose');
var random = require('mongoose-random');

var contentSchema = new mongoose.Schema({
  title: String,
  text: {
    author: String,
    body: String,
    file: String,
    link: String
  },
  image: {
    caption: String,
    url: String,
    thumb: String,
    small: String,
    large: String,
    size: Number
  },
  date: Date,
  user: String,
  public: Boolean,
  tags: [String],
  container_connection: [String]
});

module.exports = mongoose.model('content', contentSchema);