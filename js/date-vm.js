var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]

var militaryTime = false;
//array created to hold all the day's events
var daysEvents = [];

//Handle resize of window
if(window.screen.height > events.style.height){
      $('#events').addClass('events-top')
   } else{
      $('#events').removeClass('events-top')
   }


window.addEventListener('resize', function(){
   var events = document.getElementById('events')
   if(window.screen.height > events.style.height){
      $('#events').addClass('events-top')
   } else{
      $('#events').removeClass('events-top')
   }
})

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
		// logEvents();
      },
   })
}
getEventsForDay();

var expandEvent = function(event){
   if(event.style.maxHeight == event.scrollHeight+'px'){
      event.style.maxHeight = '80px'
   }
   else{
      event.style.maxHeight = event.scrollHeight+'px'
   }
   var events = document.getElementById('events')
   if(window.screen.height > events.style.height){
      $('#events').addClass('events-top')
   } else{
      $('#events').removeClass('events-top')
   }
}

//This method puts all the events in daysEvents onto the page   
//pre: daysEvents is filled with all events on the page's date
//post: returns undefined
function drawEvents(){
   var eventsDiv = document.getElementById('events')
   var events = []
   for(var i=0;i<daysEvents.length;i++)
   {
      events[i] = document.createElement('div')
      events[i].setAttribute('class','event')
      events[i].setAttribute('id',daysEvents[i].id)
      events[i].style.backgroundColor = daysEvents[i].color
      events[i].onclick = function(){expandEvent(this)}
      eventsDiv.appendChild(events[i])
      //add name to elements
      var eventName = document.createElement('div')
      eventName.setAttribute('class','event-name')
      eventName.textContent = daysEvents[i].name
      events[i].appendChild(eventName)


      var eventTime = document.createElement('div')
      eventTime.setAttribute('class','event-time')
      eventTime.textContent = getTimes(daysEvents[i].blocks)
      events[i].appendChild(eventTime)

      //user's name textbox
      var usersName = document.createElement('input')
      usersName.setAttribute('class','event-users-name')
      usersName.setAttribute('type','text')
      usersName.setAttribute('placeholder','Enter Your Name')
      events[i].appendChild(usersName)
      //prevents the click handler on parent element
      $(".event-users-name").click(function(e) {
         e.stopPropagation();
      });

      //add checkbox's for time blocks
      var blocks = daysEvents[i].blocks.split(',')
      for(var j=0;j<blocks.length;j++) {
         var eventsBlocks = []
         eventsBlocks[j] = {}
         eventsBlocks[j].label = document.createElement('label')
         eventsBlocks[j].label.setAttribute('class','block-label')
         //Convert blocks to times here!
         eventsBlocks[j].label.innerHTML = blocksConversion(blocks[j])
         //keep on creating the hmtl
         eventsBlocks[j].input = document.createElement('input')
         eventsBlocks[j].input.setAttribute('type','checkbox')
         eventsBlocks[j].input.setAttribute('name','block'+j)
         eventsBlocks[j].input.setAttribute('value',blocks[j])
         eventsBlocks[j].label.appendChild(eventsBlocks[j].input)
         events[i].appendChild(eventsBlocks[j].label)
         $(".block-label").click(function(e) {
            e.stopPropagation();
         });
      }

      var submitBtn = document.createElement('button')
      submitBtn.setAttribute('class','user-submit-btn')
      submitBtn.textContent = 'Submit'
      events[i].appendChild(submitBtn)
      $(".user-submit-btn").click(function(e) {
            e.stopPropagation();
      });
      //add onclick to submite btn and handle a submission
      submitBtn.onclick = function(){
         addUserToEvent(this.parentElement)
         clearEventFields(this.parentElement)
      }
   }
}

var clearEventFields = function(element) {
   var children = element.childNodes
   children[2].value = ''
   for(var i=3;i<children.length-1;i++){
      var box = children[i].childNodes
      box[1].checked = false
   }
   expandEvent(element)
}

var addUserToEvent = function(element) {
   var event = {} 
   //check input
   var children = element.childNodes
   //check name
   if(checkUsersName(children[2].value) == false){
      return;
   }
   var name = children[2].value;
   var noTimeSelected = true
   var peopleBlockString = ''
   for(var j=3;j<children.length-1;j++){
      var checkbox = children[j].childNodes
      if(checkbox[1].checked){
         peopleBlockString = peopleBlockString+','+checkbox[1].value
      }
   }
   if(peopleBlockString == ''){
         return;
      }

   //finalize the new people string
   peopleBlockString = name + peopleBlockString + '__'
   
   //get the corresponding event
   for(var i=0;i<daysEvents.length;i++){
      if(daysEvents[i].id == element.id){
         event = daysEvents[i]
      }
   }
   //this if is so undefined doesnt get added to name is event.people is empty
   if(event.people){
      event.people = event.people + peopleBlockString
   }
   else {
      event.people = peopleBlockString
   }
   
   updateEvent(event)
}

var updateEvent = function(data){
   var url = 'http://localhost:8080/event/'+data.id
   $.ajax({
      url: url,
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: "json",
      success: function(data){
         console.log("success ",data)
      },
   })
}

//Checks the inputed name
var checkUsersName = function(name){
   if(name == ''){
      return false
   }
   else{
      for(var i=0;i<name.length;i++){
         if(name.charAt(i) == '_'){
            return false
         }
      }
      return true
   }
}

var convertToStandardTime = function(){
   militaryTime = false
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = 'black'
   document.getElementById('time-format__military').style.color = '#878787'
   drawEvents()
}

var convertToMilitaryTime = function(){
   militaryTime = true
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = '#878787'
   document.getElementById('time-format__military').style.color = 'black'

   drawEvents()
}

//function that converts blocks into times
function logEvents()
{
	for(let i=0;i<daysEvents.length;i++)
	{
		//TODO: fancy DOM editting magic to make this look better
		document.write(daysEvents[i].name + "\n");
		document.write("\t"+getTimes(daysEvents[i].blocks)+"\n\n");
		let attendees = getPeopleArray(daysEvents[i].people);
		for(let j=0;j<attendees.length;j++)
			document.write(JSON.stringify(attendees[j]))
	}
}

//function that formats the string of event participants
//pre: peopleString is properly formatted from the database
//post: returns an array of formatted participants' data
function getPeopleArray(peopleString)
{
	//peopleArr is an array of objects with properties name and availableTimeBlocks
	let peopleArr = [];
	
	//UnparsedArr is an array of strings that say the participant's name and available time blocks, all separated by commas
	let peopleUnparsedArr = [];
	let temp = "";
	
	for(let i=0;i<peopleString.length;i++)
	{
		//if the current character is an underscore, look for another one next, else concatenate temp with current character
		if(peopleString.charAt(i)=="_")
		{
			if(peopleString.charAt(i+1)=="_")
			{
				//push temp to peopleArr
				peopleUnparsedArr.push(temp);
				
				//reset temp
				temp = "";
				
				//iterate i extra since we already know that i+1 is an underscore and to avoid array out of bounds at end of string
				i++;
			}
			else
				temp = temp + peopleString.charAt(i);
		}
		else
			temp = temp + peopleString.charAt(i);
	}
	
	//now, peopleUnparsedArr is assembled, so each string is parsed and broken down further
	for(let j=0;j<peopleUnparsedArr.length;j++)
	{
		let parseTemp = "";
		let personObj = {
			name: "",
			availableTimeBlocks: ""};
		let nameFound = false;
		let person = peopleUnparsedArr[j];
		
		//parsing persom string
		for(let i=0;i<person.length;i++)
		{
			//for the first comma it finds, it sets personObj's name property and resets parseTemp.
			//everything after the name is found is concatenated into parseTemp
			if(!nameFound&&person.charAt(i)==",")
			{
				personObj.name = parseTemp;
				parseTemp = "";
				nameFound = true;
			}
			else
				parseTemp = parseTemp + person.charAt(i);
		}
		//second part of string formatted by getTimes, then added into availableTimeBlocks property
		personObj.availableTimeBlocks = getTimes(parseTemp);
		//personObj gets added to the array peopleArr
		peopleArr.push(personObj);
	}
	
	return peopleArr;
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
			if(i!==blocksArr.length-1){
				outputString = outputString + ", ";
         }
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
	
	if(militaryTime)
	{
		if(block/2<10)
			temp = temp + "0";
		temp = temp + Math.floor(block/2);
		//then, if block is odd, that means it represents a :30 time, otherwise it represents a :00 time
		if(block%2===1)
			temp = temp + ":30";
		else
			temp = temp + ":00";
	}
	else
	{
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
	}
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
