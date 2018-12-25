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
app_detail.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
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
                    res.jsonp(result_annotation)
                });
        }),
        app_detail.post("/annotate/", (req, res) => {
            var obj = req.body;
            let annotation = (JSON.parse(Object.keys(obj)[0])["annotationObject"]);
            try {
                database.collection('annotations').insertOne(annotation, (error, result) => {

                });
            } catch (e) {
                
                console.log(e);
            }
            res.send(annotation);
        })
})

/* database.collection("RequestCollection").insertOne({ "requester": req.params.requester, "requestee": req.params.requestee, "isAccepted": "false" }, (error, result) => {
    if (error) {
        return res.status(500).send(error);
    }
    res.send(result)
}); */