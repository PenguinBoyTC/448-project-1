var existingEvents = []

$.ajax({
   url: 'https://open-invite-ku.herokuapp.com/admin/events',
   method: 'GET',
   contentType: 'application/json',
   dataType: "json",
   success: function(data){
      for(var i=0;i<data.length;i++){
         existingEvents.push(data[i])
      }
      buildEventElements()
   },
})

var militaryTime = false;

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
   document.getElementById('create-event-submit').onclick = function(){createEvent()}
}

var createEvent = function(){
   event = {}
   date = document.getElementById('datepicker-create').value
   formattedDate =  date.replace('/','_')
   formattedDate =  formattedDate.replace('/','_')
   event.Date = formattedDate
   event.Name = document.getElementById('create-event__name').value

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
   clearCreateEventElements()
   var valid =  checkEventFields(event)
   if(valid){
      $.ajax({
         url: 'https://open-invite-ku.herokuapp.com/create',
         method: 'POST',
         data: JSON.stringify(event),
         contentType: 'application/json',
         dataType: "json",
         success: function(data){
            console.log("success")
         },
      })
   }
   
}

var checkEventFields = function(event) {
   if(event.Blocks == '' || event.Name == '' || event.Date == '') {
      return false
   }
   return true  
}

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

var buildEventElements = function(){
   for(var i=0;i<existingEvents.length;i++){
      var event = document.createElement('div')
      event.setAttribute('class','existing-event')
      event.style.backgroundColor = existingEvents[i].color
      event.onclick = function(){expandEvent(this)}
      document.getElementById('existing-events-container').appendChild(event)

      var eventName = document.createElement('span')
      eventName.textContent = existingEvents[i].name
      eventName.setAttribute('class','existing-event__name')
      event.appendChild(eventName)

      var eventDate = document.createElement('span')
      eventDate.textContent = existingEvents[i].date
      eventDate.setAttribute('class','existing-event__date')
      event.appendChild(eventDate)

      var eventTimes = document.createElement('div')
      eventTimes.textContent = getTimes(existingEvents[i].date)
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
   }
}

var expandEvent = function(event){
   if(event.style.maxHeight == event.scrollHeight+'px'){
      event.style.maxHeight = '80px'
   }
   else{
      event.style.maxHeight = event.scrollHeight+'px'
   }
}

var convertToStandardTime = function(){
   militaryTime = false
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = 'black'
   document.getElementById('time-format__military').style.color = '#878787'
   $('.create-event__time-block-container').empty()
   $('#existing-events-container').empty()
   buildCreateElements()
   buildEventElements()
}

var convertToMilitaryTime = function(){
   militaryTime = true
   $('#events').empty()
   document.getElementById('time-format__standard').style.color = '#878787'
   document.getElementById('time-format__military').style.color = 'black'
   $('.create-event__time-block-container').empty()
   $('#existing-events-container').empty()
   buildCreateElements()
   buildEventElements()
}