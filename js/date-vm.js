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

var toggleEventForm = function(){
   if(document.getElementById('eventForm').style.display == 'none'){
      document.getElementById('eventForm').style.display = 'block'
   }
   else {
      document.getElementById('eventForm').style.display = 'none'  
   }
}
