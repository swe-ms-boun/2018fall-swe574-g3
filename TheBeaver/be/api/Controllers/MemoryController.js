const config = require('../Config.js');
Memory = require('../Models/Memory')

exports.getAvailableMemories = (req, res) => {
    Memory.getMemory((err, memories) => {
        console.log(res);
        res.json(memories);
    });
};2