const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./api/Config.js');
const PORT = 3001;
const routes = require('./api/routes/index.js'); // Importing route definitions

const app = express();

var username = config.username;
var password = config.password;

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://" + username + ":" + password + "@living-memory-tvs0t.mongodb.net/test?retryWrites=true"

// MongoDB Connection
/* 
MongoClient.connect(uri, function (err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
        throw(err);
    }
    console.log('Connected...');
    const collection = client.db("LivingMemory").collection("Memory");
    // perform actions on the collection object
    collection.find({}).toArray((err, result) => {
                if (err) throw err;
                console.log(result);
    });
    client.close();
});
*/

// Mongoose Connection

mongoose.connect(uri)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("connected...")
});

// Binding our routes with the server instance
routes(app);

app.listen(PORT, () => console.log('App running @' + PORT));
