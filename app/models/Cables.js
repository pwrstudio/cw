// grab the mongoose module
var mongoose = require('mongoose');

var cablesSchema = new mongoose.Schema({
  id: String,
  cable_id: Number,
  description: [{
    landing_point_id: Number,
    coordinates: [],
    geohash: String,
    name: String,
    loc: {
      //      index: '2dsphere',
      type: {
        type: String,
        default: "Point"
      },
      coordinates: []
    }
}],
  name: String,
  Color: String,
  length: String,
  coordinates: String,
  rfs: String,
  owners: String,
  url: String,
  col10: String
});

cablesSchema.statics.search = function (search, cb) {
  var qry = this.find();
  console.log(search);
  if (search.loc) {
    qry.where('description.loc').near({
      center: {
        type: 'Point',
        coordinates: search.loc
      },
      maxDistance: 50000
    });
  }
  qry.exec(cb);
};

module.exports = mongoose.model('cables', cablesSchema, 'cables');