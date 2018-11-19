var mongoose = require('mongoose');

// Create the schema for the Memory database
var memorySchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
});

// Create a model for the schema
const Memory = mongoose.model('Memory', memorySchema, 'memories');
module.exports = Memory;

module.exports.getMemory = (callback) => {
    Memory.find(callback)
}