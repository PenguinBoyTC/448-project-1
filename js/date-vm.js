var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);
var Airtable = require('airtable');
var base = new Airtable({apiKey: 'YOUR_API_KEY'}).base('app2SkZOQcF0m2jZG');

//pre: events airtable is sorted
//post: returns array of events on a day
function getEvents(formattedDate)
{
	//create an array to hold events data
	let eventsArr;
	
	//use airtable to find events on day
	base('Events').select().eachPage(function page(records, fetchNextPage) 
		{
		// This function (`page`) will get called for each page of records.

		records.forEach(function(record) 
			{
				if(formattedDate===record.get("Date"))
				{
					let ev = new Event(record.get("Name"),record.get("Color"),record.get("Date"),record.get("Blocks"),record.get("People"));
					eventsArr.push(ev);
					console.log(record.get("Name"));
				}
			});
		fetchNextPage();

		}, function done(err) 
			{
				if (err) { console.error(err); return; }
			}
	);
	
	
	return eventsArr;
}

function drawEvents()
{
	let formDate;
	let eventsArr = getEvents(formDate);
	
	//fancy DOM editting magic
	
}