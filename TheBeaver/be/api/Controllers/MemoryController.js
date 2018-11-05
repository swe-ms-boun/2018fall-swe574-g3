const config = require('../Config.js');

exports.getAvailableMemories = (req,res) => {
    config.twitterClients[0].get('memories/available', (error, memories, response) => {
        return res.json(memories); 
    });
}
