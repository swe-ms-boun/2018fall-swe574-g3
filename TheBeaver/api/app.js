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
    annotations_list=[];
    concatenated_string='';
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true }, (error, client) => {
        if (error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection('memories');
        console.log('Connected to memories');
    }),
        app_detail.get("/post/:id", (req, res) => {
            database.collection('annotations').find({ "body" : {'$regex' : req.params.id, '$options' : 'i'}})
            .toArray((error_annotation, result_annotation) => {
                if (error_annotation) {return res.status(500).send(error_annotation)};
                result_annotation.forEach(function (element,i) {
                    annotations_list.push(element.target.selector.value);
                    concatenated_string+="\n var path = '"+annotations_list[i]+
                    "'\n getElementByXPath(path).style.backgroundColor='yellow'\n";
                });
                
           // console.log(typeof req.params.id)
           // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            collection.findOne({ _id: new ObjectId(req.params.id)}, (error_detail, result_detail) => {
                if (error_detail) {return res.status(500).send(error_detail)};
                console.log(concatenated_string);
                res.send(`
                    <html><body><h1>`+
                    result_detail["username"]+`
                    </h1><div><p>`+
                    result_detail["description"]+`
                    </p></div></body>
                    <script>var getElementByXPath = function(a,b){b=document;return b.evaluate(a,b,null,9,null).singleNodeValue}`+
                   concatenated_string+
                    `</script>
                    </html>`
                    
                    )
                    concatenated_string="";
                     // çünkü obje olduğunu anlamıyor jövösökröpt inanılmaz... [" "] kullanımı zorunlu.
                    
            }
                    )})
})})
