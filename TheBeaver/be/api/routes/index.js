module.exports = (app) => {
    // Bind the controller to the route
    const memoryController = require('../Controllers/MemoryController.js');
    
    app.route('/memories')
        .get(memoryController.getAvailableMemories)

    app.get('/memory/:id', memoryController.getMemory)

    app.route('/postMemory')
        .post(memoryController.postMemory)

    app.route('/deleteMemory')
        .delete(memoryController.deleteMemory)
};