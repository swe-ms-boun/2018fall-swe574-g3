var mongoose = require('mongoose');

// Create the schema for the Memory database
var memorySchema = mongoose.Schema({
    username:String,
    title: String,
    description: String,
    isPublic: Boolean

});

// Create a model for the schema
const Memory = mongoose.model('Memory', memorySchema, 'memories');
module.exports = Memory;