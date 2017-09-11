var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);

//array created to hold all the day's events
var daysEvents = [];

//Funciton from PhiLho & Anil Namde of Stack Overflow - https://stackoverflow.com/questions/276479/javascript-how-to-validate-dates-in-format-mm-dd-yyyy
function validateDate(date)
{
    var matches = /^(\d{1,2})[_\/](\d{1,2})[_\/](\d{4})$/.exec(date);
    if (matches == null) return false;
    var d = matches[2];
    var m = matches[1] - 1;
    var y = matches[3];
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;

}

var dateValidity = validateDate(pageDate)
if(!dateValidity) {
   //TODO: Change this to the proper URL once deployed
   window.location.href = 'http://localhost:8080';
}


//uses server to get all the events on the date of the page
var getEventsForDay = function(){
   $.ajax({
      url: "http://localhost:8080/date/"+pageDate+"/events",
      method: "GET",
      dataType: "json",
      success: function(serverEventsArr){
		  for(let i=0;i<serverEventsArr.length;i++)
		  {
			  daysEvents.push(serverEventsArr[i]);
		  }
		drawEvents();
		logEvents();
      },
   })
}
getEventsForDay();

//This method puts all the events in daysEvents onto the page   
//pre: daysEvents is filled with all events on the page's date
//post: returns undefined
function drawEvents()
{
}

function logEvents()
{
	for(let i=0;i<daysEvents.length;i++)
	{
		//TODO: fancy DOM editting magic to make this look better
		document.write(daysEvents[i].name + "\n");
		document.write("\t"+getTimes(daysEvents[i].blocks)+"\n\n");
	}
}

//function that formats the string of event participants
//pre: peopleString is properly formatted from the database
//post: returns an array of formatted participants' data
function getPeopleArray(peopleString)
{
	
}

//function that formats blocks into times
//pre: timeBlocks is formatted correctly: non-negative numbers separated by commas, ordered from least to greatest
//post: returns string that says times
function getTimes(timeBlocks)
{
	let blocksArr = [];
	let outputString = "";
	
	//temporary string to hold blocks, in case they're longer than 1 character
	let temp = "";
	
	for(let i=0;i<timeBlocks.length;i++)
	{
		//if the current character is a comma, push temp
		if(timeBlocks.charAt(i)===",")
		{
			blocksArr.push(temp);
			temp = "";
		}
		//if the current character isn't a comma, concatenate temp and the current character and put it back into temp
		else
		{
			temp = temp+timeBlocks.charAt(i);
		}
	}
	//since there's no comma at the end of timeBlocks, push temp if it's not empty
	if(temp)
		blocksArr.push(parseInt(temp));
	
	//blocksArr is now full, so outputString can now be constructed
	for(let i=0;i<blocksArr.length;i++)
	{
		//if it's the start block for a given set of consecutive blocks, write the start time
		if(i===0||blocksArr[i]!=(parseInt(blocksArr[i-1])+1))
		{
			outputString = outputString + blocksConversion(parseInt(blocksArr[i]))+" - ";
		}
		//if it's the end block for a given set of consecutive blocks, write the end time
		if(i===blocksArr.length||blocksArr[i]!=(parseInt(blocksArr[i+1])-1))
		{
			outputString = outputString + blocksConversion(parseInt(blocksArr[i])+1);
			//if it's not the last block, put a comma to separate times
			if(i!==(blocksArr.length-1))
				outputString = outputString + ", ";
		}
	}
	
	return outputString;
}

//converts given block string to 12-hour time string
//pre: block is a number between 0 and 48
//post: returns converted string
function blocksConversion(block)
{
	let temp = "";
	//in the event that the event ends at midnight, read midnight as block 0, not block 48
	if(block==48)
		block = 0;
	//if block/2 is zero, that means it's 12am or 12:30am, so add 12 to temp
	if(Math.floor(block/2)===0)
		temp = temp + "12";
	//else if block>26, that means block/2 is more than 12, so we subtract 12 from it and add it to temp
	else if(block>=26)
		temp = temp + Math.floor((block/2-12));
	//else we just add block/2 to temp
	else
		temp = temp + Math.floor((block/2));
	
	//then, if block is odd, that means it represents a :30 time, otherwise it represents a :00 time
	if(block%2===1)
		temp = temp + ":30";
	else
		temp = temp + ":00";
	
	//adds am to blocks before and including 11:30am, adds pm to those after
	if(block>23)
		temp = temp + "pm";
	else
		temp = temp + "am";
	return temp;
}

var toggleEventForm = function(){
   if(document.getElementById('eventForm').style.display == 'none'){
      document.getElementById('eventForm').style.display = 'block'
   }
   else {
      document.getElementById('eventForm').style.display = 'none'  
   }
}
//add event handler to the create event btn. Wrapped in page load to make sure that the handler works
window.addEventListener('load', function(){
   var submit = document.getElementById('submit-btn')
   if(submit.addEventListener){
      submit.addEventListener('click', createEvent, false)
   }
   else {
      submit.attachEvent('onclick', createEvent)
   }
})

var createEvent = function(){
   var event = new Event(document.getElementById("eventName").value, '#eeeeee', pageDate,'1,2', document.getElementById("userName").value)
   console.log(event)
   document.getElementById('eventForm').style.display = 'none'  
}
