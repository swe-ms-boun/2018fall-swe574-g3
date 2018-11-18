var mongoose = require('mongoose');

var memorySchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
});

Memory = module.exports = mongoose.model('Memory', memorySchema);

module.exports.findMemories = (callback, limit) => {
    Memory.find(callback).limit(limit)
}