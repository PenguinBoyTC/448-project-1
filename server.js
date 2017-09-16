var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser')

//models
var Event = require('./backend-models/event.js')

// viewed at http://localhost:8080
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('view engine', 'html');
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));

var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keyz6nhx5XT4NyMUp'
});
var base = Airtable.base('app2SkZOQcF0m2jZG');

app.route('/event/:id')
   .post(function(req,res){
      base('Events').update(req.params.id, {
        "People": req.body.people
      }, function(err, record) {
          if (err) { console.error(err); return; }
          res.send('success')
         });
   })

app.get('/admin', function (req, res,next) {
   res.sendFile(path.join(__dirname + "/admin.html"));
   app.use(function(req, res, next) {
      next();
   });
})

app.get('/date/:date', function (req, res,next) {

   res.sendFile(path.join(__dirname + "/date.html"));
   app.use(function(req, res, next) {
      next();
   });
})

//create an array to hold events data

//GET function for the date pages, finds all events in eventsArr on the same date as the date parameter
//pre: eventsArr has all events on it
//post: returns array of events on specific date
app.get("/date/:date/events", function(req,res,next){
   var eventsArr = [];
   base('Events').select({
         view: "Grid view"
   }
   ).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
            //TODO: make eventsArr use event model instead of record references
               record.fields.Id = record.id
               eventsArr.push(record.fields);
         });
      fetchNextPage();

      }, function done(err) {
         if (err) { console.error(err); return; }
         var date = req.params.date;
         var datesEvents = [];
         for(var i=0;i<eventsArr.length;i++){
            if(date==eventsArr[i].Date){
               datesEvents.push(new Event(eventsArr[i]));
            }
         }
         res.send(datesEvents);
         next()
         })
})

app.get("/admin/events", function(req,res,next){
   var eventsArr = [];
   base('Events').select({
         view: "Grid view"
   }
   ).eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function(record) {
               record.fields.Id = record.id
               eventsArr.push(record.fields);
         });
      fetchNextPage();
      }, function done(err) {
         if (err) { console.error(err); return; }
         var datesEvents = [];
         for(var i=0;i<eventsArr.length;i++){
            datesEvents.push(new Event(eventsArr[i]));
         }
         res.send(datesEvents);
         next()
         })
})

app.post("/create", function(req,res,next){
   base('Events').create({
     "Name": req.body.Name,
     "Color": req.body.Color,
     "Date": req.body.Date,
     "People": req.body.People,
     "Blocks": req.body.Blocks
   }, function(err, record) {
         if (err) { console.error(err); return; }
         res.send(record)
      });
})

var port = 8080
app.listen(port);
console.log("App running on port ",port)