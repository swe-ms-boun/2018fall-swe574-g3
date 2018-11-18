const config = require('../Config.js');
Memory = require('../Models/Memory.js')

exports.getAvailableMemories = (req, res) => {
    Memory.findMemories((err, memories) => {
        res.json(memories);
    });
};
