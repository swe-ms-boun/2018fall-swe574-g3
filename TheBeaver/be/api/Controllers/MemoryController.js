const config = require('../Config.js');
Memory = require('../Models/Memory')

exports.getAvailableMemories = (req, res) => {
    Memory.getMemory(function (err, memories) {
        res.json(memories);
    });
};

exports.postMemory = ((req, res) => {
    var myData = new Memory(req.body);
    myData.save()
    .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        })
});