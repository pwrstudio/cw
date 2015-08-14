/*
 *
 *  Visitor
 *
 */

var mongoose = require('mongoose');

var visitorSchema = new mongoose.Schema({
  ip: Number,
  geohash: String,
  visits: Number
});

module.exports = mongoose.model('visitor', visitorSchema);