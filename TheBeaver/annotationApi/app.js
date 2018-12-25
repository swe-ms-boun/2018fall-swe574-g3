const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://dbretriever:dbretriever@living-memory-tvs0t.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "BeaverAnnotation";
const COLLECTION_NAME = "annotations"


var app = Express();
var app_detail = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app_detail.use(BodyParser.json());
app_detail.use(BodyParser.urlencoded({ extended: true }));

var database;

app_detail.listen(8004, () => {
    annotations_list = [];
    concatenated_string = '';
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection(COLLECTION_NAME);
        console.log('Connected to ' + COLLECTION_NAME);
    }),
        app_detail.get("/annotation/*", (req, res) => {
            console.log(req.params);
            database.collection('annotations').find({ "target.source": { '$regex': req.params['0'], '$options': 'i' } })
                .toArray((error_annotation, result_annotation) => {
                    if (error_annotation) { return res.status(500).send(error_annotation) };
                    res.jsonp(result_annotation[0])
                });
        }),
        app_detail.post("/annotate/", (req, res) => {
            
              then(item => {
                res.send("item saved to database");
                console.log(item);
                console.log(req.body);

              })
              .catch(err => {
                res.status(400).send(err);
              });
          });
})
