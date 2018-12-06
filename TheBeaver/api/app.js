const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

const CONNECTION_URL = "mongodb+srv://dbretriever:dbretriever@living-memory-tvs0t.mongodb.net/test?retryWrites=true";
const DATABASE_NAME = "LivingMemory";


var app = Express();
var app_detail = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app_detail.use(BodyParser.json());
app_detail.use(BodyParser.urlencoded({ extended: true }));

var database, collection;

app_detail.listen(8003, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection('memories');
        console.log('Connected to memories');
    }),
        app_detail.get("/post/:id", (req, res) => {
            console.log(typeof req.params.id);
            collection.findOne({ _id: new ObjectId(req.params.id)}, (error_detail, result_detail) => {
                if (error_detail) {return res.status(500).send(error_detail)};
                res.send(`
                    <html><body><h1>`+
                    result_detail["username"]+`
                    </h1><div><p>`+
                    result_detail["description"]+`
                    </p></div></body>
                    <script>var getElementByXPath = function(a,b){b=document;return b.evaluate(a,b,null,9,null).singleNodeValue}
                    var path = '//html[1]/body[1]/div[1]/p[1]/span[1]'
                    getElementByXPath(path).style.backgroundColor='yellow'
                    var path = '//html[1]/body[1]/div[1]/p[1]/span[2]'
                    getElementByXPath(path).style.backgroundColor='yellow'
                    var path = '//html[1]/body[1]/div[1]/p[1]/span[3]'
                    getElementByXPath(path).style.backgroundColor='yellow'
                    </script>
                    </html>`
                    
                    ); // çünkü obje olduğunu anlamıyor jövösökröpt inanılmaz... [" "] kullanımı zorunlu.

            }
        )})
});
