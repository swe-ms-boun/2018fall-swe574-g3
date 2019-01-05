var mongoose = require('mongoose');

var memoryDateSchema = mongoose.Schema({
    decade: Number,
    year: Number,
    month: String,
    day: Number,
});

// Create the schema for the Memory database
var memorySchema = mongoose.Schema({
    username: String,
    title: String,
    description: String,
    isPublic: Boolean,
    taggedPeople: String,
    location: String,
    time: String,
    imgUrl: String,
    date: memoryDateSchema,
});

memorySchema.index({
    '$**': 'text'
});


// Create a model for the schema
const Memory = mongoose.model('Memory', memorySchema, 'memories');
module.exports = Memory;
