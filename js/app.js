//DATEPICKER
$('#datepicker').datepicker({
    onSelect: function(date, inst) { 
      date = date.replace('/','_')
      date = date.replace('/','_')
      window.location = 'http://localhost:8080/date/' + date;
    }
});

var createEvent = function() {   
   data={
      name: document.getElementById('name').value
   }
   $.ajax({
      url: "http://localhost:8080/event",
      data: JSON.stringify(data),
      method: "POST",
      contentType: 'application/json',
      dataType: "json",
      success: function(data){
         console.log("success ",data)
         
      },
      
   })
   navigateToDay()
   document.getElementById('name').value = ""
}

document.getElementById("btn").addEventListener("click", createEvent);

var navigateToDay = function() {
   $.ajax({
      url: "http://localhost:8080/14243",
      method: "GET"
   })
}
