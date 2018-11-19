const config = require('../Config.js');
Memory = require('../Models/Memory')

exports.getAvailableMemories = (req, res) => {
    Memory.getMemory(function (err, memories) {
        res.json(memories);
    });
};