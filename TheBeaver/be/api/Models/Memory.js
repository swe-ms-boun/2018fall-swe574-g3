var mongoose = require('mongoose')
  , Schema = mongoose.Schema

  var coordinateSchema = Schema({
    lat: Number,
    lng: Number,
  });

// Create the schema for the Memory database
var memorySchema = mongoose.Schema({
    username: String,
    title: String,
    description: String,
    isPublic: Boolean,
    taggedPeople: String,
    location: [coordinateSchema],
    time: String,
    imgUrl: String,
});

memorySchema.index({
    '$**': 'text'
});


// Create a model for the schema
const Memory = mongoose.model('Memory', memorySchema, 'memories');
module.exports = Memory;
