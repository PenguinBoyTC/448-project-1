var existingEvents = []

var getEvents = function(){$.ajax({
   url: 'http://localhost:8080/admin/events',
   method: 'GET',
   contentType: 'application/json',
   dataType: "json",
   success: function(data){
      existingEvents = []
      for(var i=0;i<data.length;i++){
         existingEvents.push(data[i])
      }
      buildEventElements()
      },
   })
}

getEvents()
var militaryTime = false;
/**
*	@Function	buildCreateElements
*	This function waits until all the information is loaded then will go in and display
*	all the active events. 
*	
*	@pre		block is a number between 0 and 48
*	@post		returns converted string
*	@since	September 17, 2017
*
*/

//wait until everything is loaded to build elements.
$(document).ready(function(){buildCreateElements()
   $( function() {
         var today = new Date()
       $( "#datepicker-create" ).datepicker({
         minDate: today
       });
     } );
   document.getElementById('datepicker-create').onclick = function(){addStylesToDatepicker()}
   var addStylesToDatepicker = function(){
      document.getElementById('ui-datepicker-div').style.backgroundColor = 'white'
      document.getElementById('ui-datepicker-div').style.padding = '25px'
   }
});
/**
*	@Function	buildCreateElements
*	This function waits until all the information is loaded then will go in and display
*	all the active events. 
*	
*	@pre		properly formatted event.
*	@post		none
*	@since	September 17, 2017
*
*/
var buildCreateElements = function(){
   var timeBlockContainers = []
   for(var i=0;i<4;i++){
      timeBlockContainers[i] = document.getElementById('create-event__time-block-container-'+i)
      var timeBlocks = []
      for(var j=1;j<13;j++){
         timeBlocks[j] = {}
         timeBlocks[j].label = document.createElement('label')
         timeBlocks[j].label.setAttribute('class','block-label-create')
         var block = j-1
         if(i==1){
            block = j+11;
         }
         else if(i==2){
            block = j+23;
         }
         else if(i==3){
            block = j+35;
         }
         timeBlocks[j].input = document.createElement('input')
         timeBlocks[j].input.setAttribute('type','checkbox')
         timeBlocks[j].input.setAttribute('name','block'+j)
         timeBlocks[j].input.setAttribute('value',block)
         timeBlocks[j].label.innerHTML = blocksConversion(block)
         timeBlocks[j].label.appendChild(timeBlocks[j].input)
         timeBlockContainers[i].appendChild(timeBlocks[j].label)
      }
   }   
}
document.getElementById('create-event-submit').onclick = function(){createEvent();}
document.getElementById('add-task-button').onclick = function(){add_task()};
document.getElementById('clear-task-button').onclick = function(){clear_tasks()};
/**
*	@Function	createEvent        
*	This function takes the contents of the event and sends that information to the AirTable
*	database.
*	
*	@pre	 	none
*	@post		none
*	@version	1.0
*	@since	September 17, 2017
*
*/

var add_task = function() {
	var task_in = prompt("Please enter a task you would like to add to the event", "Task")
	if (task_in != null)
	{
		if (task_in != "Task")
		{
			document.getElementById("tasks").innerHTML += task_in + ", ";
		}
	}
}

var clear_tasks = function() {
	document.getElementById("tasks").innerHTML = "";
}

var createEvent = function(){
   event = {}
   date = document.getElementById('datepicker-create').value
   formattedDate =  date.replace('/','_')
   formattedDate =  formattedDate.replace('/','_')
   event.Date = formattedDate
   event.Name = document.getElementById('create-event__name').value
   event.Tasks = document.getElementById('tasks').innerHTML;

   //Get time blocks that are checked
   var timeBlockContainers = []
   var timeBlocks = []
   var timeBlockCheckboxs = []
   for(var i=0;i<4;i++){
      timeBlockContainers[i] = document.getElementById('create-event__time-block-container-'+i)
      timeBlocks[i] = timeBlockContainers[i].childNodes
      for(var j=1;j<13;j++){
         var block = j-1
         if(i==1){
            block = j+11;
         }
         else if(i==2){
            block = j+23;
         }
         else if(i==3){
            block = j+35;
         }
         timeBlockCheckboxs[block] = timeBlocks[i][j-1].childNodes[1]
      } 
   }
   var checkedBoxes = ''
   for(var i=0;i<timeBlockCheckboxs.length;i++){
      if(timeBlockCheckboxs[i].checked == true){
         if(checkedBoxes == ''){
            checkedBoxes = timeBlockCheckboxs[i].value
         }
         else{
            checkedBoxes = checkedBoxes + ',' + timeBlockCheckboxs[i].value   
         }
      }
   }
   event.Blocks = checkedBoxes
   event.People = "John Gibbons," +checkedBoxes+'__';
  
   var color = Math.floor(Math.random() * 6) + 1  
   if(color == 1){
      event.Color = '#2e277b'
   }
   else if(color == 2){
      event.Color = '#273477'
   }
   else if(color == 3){
      event.Color = '#264673'
   }
   else if(color == 4){
      event.Color = '#265770'
   }
   else if(color == 5){
      event.Color = '#26666c'
   }
   else{
      event.Color = '#25685d'
   }
   clearCreateEventElements()

   var valid =  checkEventFields(event)
   if(valid){
      $.ajax({
         url: 'http://localhost:8080/create',
         method: 'POST',
         data: JSON.stringify(event),
         contentType: 'application/json',
         dataType: "json",
         success: function(data){
            console.log("success")
            $('#existing-events-container').empty()
            getEvents()
         },
      })
      submitpopwindow(); 
   }   
}


/**
*	@Function	checkEventFields
*	This function checks to see if the information that has been by the user is actually valid
*	information. It will check the information,name and date of the event.
*	
*	@pre		An active event 
*	@post		returns false if invalid information, returns true with valid information
*	@since	September 17, 2017
*
*/

var checkEventFields = function(event) {
   if(event.Blocks == '' || event.Name == '' || event.Date == '') {
      alert("Please finish all information");
      return false
   }
   else
   {
    for(var i=0;i<existingEvents.length;i++)
    {
      if(event.Name==existingEvents[i].name)
      {
        if(event.Date==existingEvents[i].date)
        {
          alert("There is a same event on the same date. Please change an another date.");
          return false;
        }
      }
    }
    return true 
   }
}
/**
*	@Function	clearCreateEventElements
*	This function clears all the active event boxes that have been checked
*	
*	@pre 		none. 
*	@post		none
*	@since	September 17, 2017
*
*/

var clearCreateEventElements = function() {
   //clear checkboxs
   var timeBlockContainers = []
   var timeBlocks = []
   for(var i=0;i<4;i++){
      timeBlockContainers[i] = document.getElementById('create-event__time-block-container-'+i)
      timeBlocks[i] = timeBlockContainers[i].childNodes
      for(var j=1;j<13;j++){
         timeBlocks[i][j-1].childNodes[1].checked = false
      } 
   }
   //clear the rest
   document.getElementById('create-event__name').value = ''
   document.getElementById('datepicker-create').value = ''
}
/**
*	@Function	buildEventElements
*	This function takes all the times slots that are going to be used for the event, it takes those
*	elements and creates time slot boxes based on how long the event is.
*	
*	@pre		none
*	@post		none
*	@since	September 17, 2017
*
*/

function buildEventElements(){

// add a for loop to merge the same event
   for(var i=0;i<existingEvents.length;i++){
      if(i>0)
      {
        if(existingEvents[i].name!=existingEvents[i-1].name)
        {
          var event = document.createElement('div')
          event.setAttribute('class','existing-event')
          event.style.backgroundColor = existingEvents[i].color
          event.onclick = function(){expandEvent(this)}
          document.getElementById('existing-events-container').appendChild(event)

          var eventName = document.createElement('h1')
          eventName.textContent = existingEvents[i].name
          eventName.setAttribute('class','existing-event__name')
          event.appendChild(eventName)

          var showmoretag = document.createElement('h2')
          showmoretag.textContent = "Click to Expand"
          showmoretag.setAttribute('class','existing-event__showmoretag')
          event.appendChild(showmoretag)
        }

        var border = document.createElement('p')
        border.textContent = "_____________________________________"
        border.setAttribute('class','existing-event__border')
        event.appendChild(border)


        var eventDate = document.createElement('span')
        eventDate.textContent = existingEvents[i].date
        eventDate.setAttribute('class','existing-event__date')
        event.appendChild(eventDate)

        var eventTimes = document.createElement('div')
        eventTimes.textContent = "Time: "+getTimes(existingEvents[i].blocks)
        eventTimes.setAttribute('class','existing-event__times')
        event.appendChild(eventTimes)
  
        var eventPeopleLabel = document.createElement('div')
        eventPeopleLabel.setAttribute('class','existing-event__people-label')
        eventPeopleLabel.textContent = 'People Attending:'
        event.appendChild(eventPeopleLabel) 
        //add people
        eventsPeople = getPeopleArray(existingEvents[i].people)
        for(var j=0;j<eventsPeople.length;j++){
           var person = document.createElement('div')
           person.setAttribute('class','existing-event__person')
           person.textContent = eventsPeople[j].name  + ' : ' + eventsPeople[j].availableTimeBlocks 
           event.appendChild(person)
        }
		
		if (existingEvents[i].tasks != null)
		{
		  var eventTaskLabel = document.createElement('div');
		  eventTaskLabel.setAttribute('class','existing-event__people-label');
		  eventTaskLabel.textContent = 'Task List:';
		  event.appendChild(eventTaskLabel);
		  
		  var eventsTasks = getTasks(existingEvents[i].tasks);
		  for (var k=0;k<eventsTasks.length;k++)
		  {
			  var task = document.createElement('div');
			  task.setAttribute('class','existing-event__person');
			  task.textContent = eventsTasks[k];
			  event.appendChild(task);
		  }
		}
      }
      else
      {
        var event = document.createElement('div')
        event.setAttribute('class','existing-event')
        event.style.backgroundColor = existingEvents[i].color
        event.onclick = function(){expandEvent(this)}
        document.getElementById('existing-events-container').appendChild(event)
  
        var eventName = document.createElement('h1')
        eventName.textContent = existingEvents[i].name
        eventName.setAttribute('class','existing-event__name')
        event.appendChild(eventName)

        var showmoretag = document.createElement('h2')
        showmoretag.textContent = "Click to Expand"
        showmoretag.setAttribute('class','existing-event__showmoretag')
        event.appendChild(showmoretag)

        var border = document.createElement('p')
        border.textContent = "_____________________________________"
        border.setAttribute('class','existing-event__border')
        event.appendChild(border)
  
        var eventDate = document.createElement('span')
        eventDate.textContent = existingEvents[i].date
        eventDate.setAttribute('class','existing-event__date')
        event.appendChild(eventDate)
  
        var eventTimes = document.createElement('div')
        eventTimes.textContent = "Time: "+getTimes(existingEvents[i].blocks)
        eventTimes.setAttribute('class','existing-event__times')
        event.appendChild(eventTimes)
  
        var eventPeopleLabel = document.createElement('div')
        eventPeopleLabel.setAttribute('class','existing-event__people-label')
        eventPeopleLabel.textContent = 'People Attending:'
        event.appendChild(eventPeopleLabel)
  
        //add people
        eventsPeople = getPeopleArray(existingEvents[i].people)
        for(var j=0;j<eventsPeople.length;j++){
           var person = document.createElement('div')
           person.setAttribute('class','existing-event__person')
           person.textContent = eventsPeople[j].name  + ' : ' + eventsPeople[j].availableTimeBlocks 
           event.appendChild(person)
        }
		
		if (existingEvents[i].tasks != null)
		{
		  var eventTaskLabel = document.createElement('div');
		  eventTaskLabel.setAttribute('class','existing-event__people-label');
		  eventTaskLabel.textContent = 'Task List:';
		  event.appendChild(eventTaskLabel);
		  
		  var eventsTasks = getTasks(existingEvents[i].tasks);
		  for (var k=0;k<eventsTasks.length;k++)
		  {
			  var task = document.createElement('div');
			  task.setAttribute('class','existing-event__person');
			  task.textContent = eventsTasks[k];
			  event.appendChild(task);
		  }
		}
      }
   }   
}
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

function expandEvent(event){
   if(event.style.maxHeight == event.scrollHeight+'px'){
      event.style.maxHeight = '80px'
   }
   else{
      event.style.maxHeight = event.scrollHeight+'px'
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

function convertToStandardTime (){
   militaryTime = false
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = 'black'
   document.getElementById('time-format__military').style.color = '#878787'
   $('.create-event__time-block-container').empty()
   $('#existing-events-container').empty()
   buildCreateElements()
   buildEventElements()
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

function convertToMilitaryTime(){
   militaryTime = true
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = '#878787'
   document.getElementById('time-format__military').style.color = 'black'
   $('.create-event__time-block-container').empty()
   $('#existing-events-container').empty()
   buildCreateElements()
   buildEventElements()
}



//Project 2 new functions for Multi-day Scheduling by Chong

/**
*	@Function	submitpopwindow
*	This function build a pop up window to choose if add a new date to a event
*	
*	@pre 		none  
*	@post		none
*	@since	October 6, 2017
*
*/

function submitpopwindow(){
  var mywindow = document.getElementById("myWindow");
  var inline = document.getElementsByClassName('close')[0];
  var yes = document.getElementById("Yes_Button");
  var no = document.getElementById("No_Button");
  mywindow.style.display = "block";

  inline.onclick = function(){mywindow.style.display="none";}
  no.onclick = function(){mywindow.style.display="none";navigateToadmin();}
  yes.onclick = function(){navigateToaddnewdate();}

}

/**
*	@Function	copyTime
*	This function allow the creator to copy the previous timeslots to here
*	
*	@pre 		none  
*	@post		none
*	@since	October 7, 2017
*
*/

function copyTime(){
  var exist_event = existingEvents[existingEvents.length-1];
  document.getElementById('adddate_name').value = exist_event.name;
  var str_slots = exist_event.blocks;
  str_slots='['+str_slots+']';
  var timeslots = new Array();
  timeslots =JSON.parse(str_slots);
  var timeBlockContainers = []
  var timeBlocks = []
  var timeBlockCheckboxs = []
  for(var i=0;i<4;i++){
     timeBlockContainers[i] = document.getElementById('create-event__time-block-container-'+i)
     timeBlocks[i] = timeBlockContainers[i].childNodes
     for(var j=1;j<13;j++){
        var block = j-1
        if(i==1){
           block = j+11;
        }
        else if(i==2){
           block = j+23;
        }
        else if(i==3){
           block = j+35;
        }
        timeBlockCheckboxs[block] = timeBlocks[i][j-1].childNodes[1]
     } 
  }
  for(var i=0;i<timeslots.length;i++)
  {
    timeBlockCheckboxs[timeslots[i]].checked = true;
  }
}


/**
*	@Function	addnewdate
*	This function can add a new date to exist event to the data base
*	
*	@pre 		none  
*	@post		none
*	@since	October 7, 2017
*
*/
function addnewdate(){
  console.log(existingEvents);
  console.log(existingEvents.length-1);
  var exist_event = existingEvents[existingEvents.length-1];
  event = {}
  date = document.getElementById('datepicker-create').value
  formattedDate =  date.replace('/','_')
  formattedDate =  formattedDate.replace('/','_')
  event.Date = formattedDate
  event.Name = exist_event.name
  console.log(event.Name);
  //Get time blocks that are checked
  var timeBlockContainers = []
  var timeBlocks = []
  var timeBlockCheckboxs = []
  for(var i=0;i<4;i++){
     timeBlockContainers[i] = document.getElementById('create-event__time-block-container-'+i)
     timeBlocks[i] = timeBlockContainers[i].childNodes
     for(var j=1;j<13;j++){
        var block = j-1
        if(i==1){
           block = j+11;
        }
        else if(i==2){
           block = j+23;
        }
        else if(i==3){
           block = j+35;
        }
        timeBlockCheckboxs[block] = timeBlocks[i][j-1].childNodes[1]
     } 
  }
  var checkedBoxes = ''
  for(var i=0;i<timeBlockCheckboxs.length;i++){
     if(timeBlockCheckboxs[i].checked == true){
        if(checkedBoxes == ''){
           checkedBoxes = timeBlockCheckboxs[i].value
        }
        else{
           checkedBoxes = checkedBoxes + ',' + timeBlockCheckboxs[i].value   
        }
     }
  }
  event.Blocks = checkedBoxes
  event.People = 'John Gibbons,'+checkedBoxes+'__'
  var color = Math.floor(Math.random() * 6) + 1  
  if(color == 1){
     event.Color = '#2e277b'
  }
  else if(color == 2){
     event.Color = '#273477'
  }
  else if(color == 3){
     event.Color = '#264673'
  }
  else if(color == 4){
     event.Color = '#265770'
  }
  else if(color == 5){
     event.Color = '#26666c'
  }
  else{
     event.Color = '#25685d'
  }
  var valid =  valid2(event)
  if(valid){
     $.ajax({
        url: 'http://localhost:8080/create',
        method: 'POST',
        data: JSON.stringify(event),
        contentType: 'application/json',
        dataType: "json",
        success: function(data){
           console.log("success")
           $('#existing-events-container').empty()
           getEvents()
        },
     })
     submitpopwindow();
  }
  
}

/**
*	@Function	navigateToaddnewdate
*	This function can navigate To addnewdate.html
*	
*	@pre 		none  
*	@post		none
*	@since	October 7, 2017
*
*/
function navigateToaddnewdate(){ 
  window.location = 'http://localhost:8080/addnewdate'
}
/**
*	@Function	navigateToadmin
*	This function can navigate To admin.html
*	
*	@pre 		none  
*	@post		none
*	@since	October 7, 2017
*
*/
function navigateToadmin(){
  window.location = 'http://localhost:8080/admin'
}

/**
*	@Function	valid2
*	This function will check the new date information. One event cannot be the same date.
*	
*	@pre 		none  
*	@post		none
*	@since	October 7, 2017
*
*/

function valid2(event){
  if(event.Blocks == ''|| event.Date == '') {
    alert("Please choose a date and timeslots");
    return false
 }
 else
 {
    for(var i=0;i<existingEvents.length;i++)
    {
      if(event.Name==existingEvents[i].name)
      {
        if(event.Date==existingEvents[i].date)
        {
          alert("Please choose an another date");
          return false;
        }
      }
    }
    return true  
 } 
}

