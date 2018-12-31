const config = require('../Config.js');
Memory = require('../Models/Memory');

exports.getAvailableMemories = (req, res) => {
    let query = {};
    if (req.query.username) {
        query.username = req.query.username;
    }
    if (req.query.keyword && req.query.keyword != '') {
        let keyword = {
            "$text": {
                "$search": req.query.keyword
            }
        }
        Memory.find(keyword, {
            score: {
                $meta: "textScore"
            }
        })
        .then((memories) => {
            res.json(memories);
        }).catch((error) => {
            res.status(400).send("unable to get from database");
        });
        return;
    };
    Memory.find(query)
    .then( (memories) => {
        res.json(memories);
    })
    .catch(err => {
        res.status(400).send("unable to get from database");
    })
};

exports.getMemory = ((req, res) => {
    Memory.find({
        _id: req.params.id
    })
        .then((memory) => {
            res.json(memory);
        })
        .catch(err => {
            res.status(400).send("unable to get from database");
        })
});

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

exports.deleteMemory = ((req,res) => {
    Memory.deleteOne( {_id: req.body.id})
    .then(memory => {
        const response = {
            message: "Memory successfully deleted",
            id: memory._id
        };
        return res.status(200).send(response);
    })
    .catch(err => {
       res.status(400).send("unable to delete from database");
    })
});