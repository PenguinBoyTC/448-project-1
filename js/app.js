/**
*	@File		app.js 
*	This app.js file navigates between different html documents. It also functions with
*	communicating with the AirTable database in creating an event.
*	
*	@version	1.0
*	@since		September 17, 2017
*
*/

//DATEPICKER
$('#datepicker').datepicker({
    onSelect: function(date, inst) { 
      date = date.replace('/','_')
      date = date.replace('/','_')
      window.location = 'http://localhost:8080/date/' + date;
    }
});

//************
//FUNCTION FOR QUINN. USE TO CREATE EVENT. 
//************
/**
*	@Function	navigateToAdminMode
*	This function calls the admin mode html window.
*	
*	@pre	 	none
*	@post		none
*	@version	1.0
*	@since	September 17, 2017
*
*/

var navigateToAdminMode = function() {
   window.location = 'http://localhost:8080/admin'
}
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

// document.getElementById("btn").addEventListener("click", createEvent);
