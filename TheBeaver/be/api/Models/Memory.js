var mongoose = require('mongoose')
  , Schema = mongoose.Schema

  var coordinateSchema = Schema({
    lat: Number,
    lng: Number,
  });

var memoryDateSchema = mongoose.Schema({
    decade: Number,
    year: Number,
    month: String,
    day: Number,
    time: String,
});

// Create the schema for the Memory database
var memorySchema = mongoose.Schema({
    username: String,
    title: String,
    description: String,
    isPublic: Boolean,
    taggedPeople: String,
    location: String,
    coords: [coordinateSchema],
    imgUrl: String,
    date: memoryDateSchema,
});

memorySchema.index({
    '$**': 'text'
});


// Create a model for the schema
const Memory = mongoose.model('Memory', memorySchema, 'memories');
module.exports = Memory;
