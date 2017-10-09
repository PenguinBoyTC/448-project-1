/**
*	@File		date-vm.js
*	This date-vm.js file verifies that the date that is inputted by the user will be a valid
*	input for the event. Valid input implies that the day, month and the year are all valid
*	expressions. Users will be able to distinguish between leap years and the extra within
*	the month of February.
*	
*	@version	1.0
*	@since		September 17, 2017
*
*/

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
/**
*	@Function	validateDate
*	This function takes a date as a parameter. This function which came from stackoverflow, 
*	takes said date, and verifies that there is indeed valid information from the date.
*	
*	@pre	 	Date - takes a date as the input of the function
*	@post		a composed date via just date, month, and the year of the event.
*	@since	September 17, 2017
*
*/

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

/**
*	@Function	getEventsForDays
*	This function takes a date as a parameter. This function which came from stackoverflow, 
*	takes said date, and verifies that there is indeed valid information from the date.
*	
*	@pre	 	Date - takes a date as the input of the function
*	@post		a composed date via just date, month, and the year of the event.
*	@since	September 17, 2017
*
*/

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
      },
   })
}
getEventsForDay();

/**
*	@Function	expandEvent
*	This function takes the event and displays all the information from the event to the
*	html document. It will display all the active events from the active day.
*	
*	@pre 		event - is an active event from the 
*	@post		none
*	@since	September 17, 2017
*
*/

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
/**
*	@Function	drawEvents
*	This method puts all the events in daysEvents onto the page
*	
*	@pre 		daysEvents- is filled with all events on the page's date
*	@post		none
*	@since	September 17, 2017
*
*/

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
	  
	  if (daysEvents[i].tasks != null)
	  {		  
		  var eventTasksLabel = document.createElement('div');
		  eventTasksLabel.setAttribute('class','task-label');
		  eventTasksLabel.setAttribute('id','task_label');
		  events[i].appendChild(eventTasksLabel);
		  eventTasksLabel.textContent = 'Event Tasks';
  
		  var eventsTasks = getTasks(daysEvents[i].tasks);
		  var eventTasksSelect = document.createElement('select');
		  eventTasksSelect.setAttribute('class','eventTasksSelect');
		  eventTasksSelect.setAttribute('name','eventTasksSelect');
		  eventTasksSelect.setAttribute('id','eventTasksSelect');
		  events[i].appendChild(eventTasksSelect);
//	      eventTasksSelect.multiple = true;
		  
		  for (var k=0;k<eventsTasks.length - 1;k++)
		  {
			var option = document.createElement('option');
			option.value = eventsTasks[k];
			option.text = eventsTasks[k];
			eventTasksSelect.appendChild(option);
		  }
		  $(".eventTasksSelect").click(function(e) {
			e.stopPropagation();
			});
			document.getElementById('eventTasksSelect').selectedIndex = -1;
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
/**
*	@Function	clearEventFieldst
*	This function clears all the active events from the current day.
*	
*	@pre 		element - is an active day from the calendar. 
*	@post		none
*	@since	September 17, 2017
*
*/

var clearEventFields = function(element) {
   var children = element.childNodes
   children[2].value = ''
   for(var i=3;i<children.length-3;i++){
      var box = children[i].childNodes
      box[1].checked = false
   }
   expandEvent(element)
}
/**
*	@Function	addUserToEvent
*	This function will add a user to the event. For a user to be created to an even
*	they first need to leave their name and select the time blocks that they will be attending
*	the event for.
*	
*	@pre 		element - is an active day from the calendar.  
*	@post		none
*	@since	September 17, 2017
*
*/

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
   var num_blocks = 3;
   for(var j=3;j<children.length-3;j++){
	   num_blocks++;
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
   console.log(num_blocks);
   var trial = children[num_blocks +1];
	var trial_1 = trial.options[trial.selectedIndex].value;
   console.log(trial_1);
   
	var update_tasks = [];
	var eventsTasks = getTasks(event.tasks);

	console.log(event.tasks);
	var tasks_ = getTasks(event.tasks);
	console.log(trial.selectedIndex);
	console.log(tasks_[trial.selectedIndex]);
	var old = tasks_[trial.selectedIndex];
	tasks_[trial.selectedIndex] = "@" + old;
	event.tasks = tasks_;
   
   updateEvent(event)
}
/**
*	@Function	updateEvent
*	This function sends information from the html document to the airTable database
*	to be updated with the information
*	
*	@pre 		data - information to be updated at the database..  
*	@post		none
*	@since	September 17, 2017
*
*/

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

/**
*	@Function	checkUserName
*	This function verifies that what the user provided was valid input.
*	
*	@pre 		name - the name of the person attending event..  
*	@post		true if valid name, false if the name is invalid
*	@since	September 17, 2017
*
*/

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
/**
*	@Function	convertToStandardTime
*	This function takes all the existing military time and converts that time into
*	standard time
*	
*	@pre 		none  
*	@post		the time slots in standard time.
*	@since	September 17, 2017
*
*/

var convertToStandardTime = function(){
   militaryTime = false
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = 'black'
   document.getElementById('time-format__military').style.color = '#878787'
   drawEvents()
}
/**
*	@Function	convertToMilitaryTime
*	This function takes all the existing standard time and converts that time into
*	military time
*	
*	@pre 		none  
*	@post		the time slots in military time.
*	@since	September 17, 2017
*
*/

var convertToMilitaryTime = function(){
   militaryTime = true
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = '#878787'
   document.getElementById('time-format__military').style.color = 'black'

   drawEvents()
}
/**
*	@Function	toggleEventForm
*	This function changes the times of events from standard to military or from
*	military to standard time.
*	
*	@pre 		none  
*	@post		none
*	@since	September 17, 2017
*
*/
var toggleEventForm = function(){
   if(document.getElementById('eventForm').style.display == 'none'){
      document.getElementById('eventForm').style.display = 'block'
   }
   else {
      document.getElementById('eventForm').style.display = 'none'  
   }
}
