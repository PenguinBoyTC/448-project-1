var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);


//pre: events airtable is sorted, 
function getEvents(formattedDate)
{
	//create an array to hold references to airtable rows
	let eventsArr;
	
	//use airtable to find events on day
	
	//push event references to array
	
	return eventsArr;
}

function drawEvents()
{
	let formDate;
	let eventsArr = getEvents(formDate);
	//fancy DOM editting magic
}