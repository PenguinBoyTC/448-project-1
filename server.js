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

//create an array to hold events data
let eventsArr = [];

//use airtable to populate events array
base('Events').select(
	{
			view: "Grid view"
	}
).eachPage(function page(records, fetchNextPage) 
	{
	// This function (`page`) will get called for each page of records.

	records.forEach(function(record) 
		{
			//TODO: make eventsArr use event model instead of record references
				eventsArr.push(record);
		});
	fetchNextPage();

	}, function done(err) 
		{
			if (err) { console.error(err); return; }
		}
);

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

//GET function for the date pages, finds all events in eventsArr on the same date as the date parameter
//pre: eventsArr has all events on it
//post: returns array of events on specific date
app.get("/date/:date", function(req,res)
	{
		var date = req.params.date;
		datesEvents = [];
		console.log(date);
		for(let i=0;i<eventsArr.length;i++)
		{
			console.log(eventsArr[i].date)
			if(date==eventsArr[i].date)
			{
				datesEvents.push(eventsArr[i]);
			}
		}
		res.send(datesEvents);
	})

var port = 8080
app.listen(port);
console.log("App running on port ",port)