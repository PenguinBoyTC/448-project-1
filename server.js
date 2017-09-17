/**
* 	This program is an event planner based within an html document. When the program is 
* 	opened, it will display a calendar with the current month active within it. The user has the 
*	ability to navigate the months of the year either by going forward or going backward in
*	chronological order of. The user is able to select any date and the web document will
*	navigate to said url and display a new screen. 
*	
*	Within the the new screen it will have two different abilities. The first ability is the
*	capability to add an event for that day. The contents of what makes a date is the host of
*	the events name, the name and description of the event, and finally the times which the 
*	event will be held. The times of the events are based on 30 minutes segments with 
*	either xx:00 start of xx:30 start. When the event is created it will  be displayed within the 
*	day that is was created on. 
*	
*	The second ability to navigate click on any pre-arranged event and RSVP yourself for 
*	the event. The prerequisites for the event entail the user’s name and what times 
* 	the user will be available for the event. When the user RSVPs for the event, they will 
* 	show up under the attendees column in the event itself.
*	
*	
*	
*	
*	@author	Mark VanLandingham, Quinn Meier, Alex Bohlken, Dylan Vondracek
*	@version	1.0
*	@since	September 17, 2017
*
*/


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

/**
*	@Function		/date/:date/events
*	This function takes in two parameters. This function verifies that the date is in correct
*	format.Then the function will go to the eventArrs function and obtain all the current 
*	events for that day 
*	
*	@pre	 	eventsArr has all events on it
*	@post 		returns array of events on specific date
*	@version	1.0
*	@since	September 17, 2017
*
*/

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
/**
*	@Function		eachPage && "/admin/events"
*	Each page is just a singular HTML file that will hold all of the events for said day. It takes
*	the record of the information and the following day as parameters. It will then display
*	this information within the HTML page.	
*	
*	@pre		records-information based on the events
*			fetchNextPage- gets the next day of the month to make a clickable link.
*	@post		no return
*	@version	1.0
*	@since		September 17, 2017
*
*/

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
/**
*	@Function		/create
*	this function takes all the information from the user and displays that within the 
*	webpage.	
*	
*	@pre		a properly formatted event
*	@post		no return
*	@version	1.0
*	@since		September 17, 2017
*
*/
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