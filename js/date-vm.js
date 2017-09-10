var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);

//array created to hold all the day's events
var daysEvents = [];

//uses server to get all the events on the date of the page
$.ajax({
      url: "http://localhost:8080/date/"+pageDate,
      method: "GET",
      dataType: "json",
      success: function(serverEventsArr){
         daysEvents = serverEventsArr;
      },
      
   })

//This method puts all the events in daysEvents onto the page   
//pre: daysEvents is filled with all events on the page's date
//post: returns undefined
function drawEvents()
{
	
	//fancy DOM editting magic
	
}