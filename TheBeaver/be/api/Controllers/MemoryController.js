const config = require('../Config.js');
Memory = require('../Models/Memory')

exports.getAvailableMemories = (req, res) => {
    Memory.find()
    .then( (memories) => {
        res.json(memories);
    })
    .catch(err => {
        res.status(400).send("unable to get from database");
    })
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

exports.deleteMemory = ((req,res)=> {
    Memory.findByIdAndRemove(req.params._id, (err, todo) => {
        // As always, handle any potential errors:
        if (err) return res.status(500).send(err);
        // We'll create a simple object to send back with a message and the id of the document that was removed
        // You can really do this however you want, though.
        const response = {
            message: "Memory successfully deleted",
            id: todo._id
        };
        return res.status(200).send(response);
    });
});