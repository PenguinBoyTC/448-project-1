var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);

function drawEvents()
{
	let formDate;
	let eventsArr = getEvents(formDate);
	
	//fancy DOM editting magic
	
}