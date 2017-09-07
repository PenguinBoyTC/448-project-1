var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser')
var Event = require('./backend-models/event.js')

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

app.listen(8080);

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyz6nhx5XT4NyMUp'
});
var base = Airtable.base('app2SkZOQcF0m2jZG');

app.post("/event", function(request,response){
   base('Events').create({
      "Name": request.body.name
   }, function(err, record){
      if(err) {
         console.error(err); return;
      }
      console.log(record.getId())
   })
})
