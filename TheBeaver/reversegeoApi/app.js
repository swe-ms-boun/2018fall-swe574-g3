var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(8008, () => {
console.log('wurrkin meh');
}),
    app.get("/decode/:lat&:lng", (req, res) => {
        console.log(req.params);
//console.log("https://eu1.locationiq.com/v1/reverse.php?key=fd54c90b1022f7&lat="+req.params.lat+"&lon="+req.params.lng+"&format=json")
axios.get("https://eu1.locationiq.com/v1/reverse.php?key=fd54c90b1022f7&lat="+req.params.lat+"&lon="+req.params.lng+"&format=json")
  .then(response => {
    let str = '';
    if (response.data.address.town) {
      str += response.data.address.town;
    }

    if(response.data.address.village) {
      str += ', ';
      str += response.data.address.village;
    }
    res.jsonp(str);
  })
  .catch(error => {
    console.log(error);
  });
    });
module.exports = app;
