var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser')

//models
var Event = require('./backend-models/event.js')

// viewed at http://localhost:8080

app.set('view engine', 'html');
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

// app.all("*", function(req, res, next) {
//   res.writeHead(200, { "Content-Type": "text/plain" });
//   next();
// });

app.get('/date/:date', function (req, res) {
  // Access userId via: req.params.userId
  // Access bookId via: req.params.bookId
   res.sendFile(path.join(__dirname + "/date.html"));
   app.use(function(req, res, next) {
      res.locals.date = req.params.date;
      next();
   });
})

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyz6nhx5XT4NyMUp'
});
var base = Airtable.base('app2SkZOQcF0m2jZG');

app.post("/event", function(req,res){
   base('Events').create({
      "Name": req.body.name
   }, function(err, record){
      if(err) {
         console.error(err); return;
      }
      res.send(record.getId())
      console.log(record.getId())
   })
})

var port = 8080
app.listen(port);
console.log("App running on port ",port)