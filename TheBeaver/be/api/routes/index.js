module.exports = (app) => {
    // Bind the controller to the route
    const memoryController = require('../Controllers/MemoryController.js');

    app.route('/map')
        .get(memoryController.getAvailableMemories)
};