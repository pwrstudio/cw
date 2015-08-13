var mongoose = require('mongoose');

var collectionSchema = new mongoose.Schema({
  title: String,
  slug: String,
  link: String,
  date: Date,
  content: [String],
  private: Boolean
});

module.exports = mongoose.model('collection', collectionSchema);