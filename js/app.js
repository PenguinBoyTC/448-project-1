//DATEPICKER
$('#datepicker').datepicker({
    onSelect: function(date, inst) { 
      date = date.replace('/','_')
      date = date.replace('/','_')
      window.location = 'https://open-invite-ku.herokuapp.com/date/' + date;
    }
});

//************
//FUNCTION FOR QUINN. USE TO CREATE EVENT. 
//************

var navigateToAdminMode = function() {
   window.location = 'https://open-invite-ku.herokuapp.com/admin'
}

var createEvent = function() {   
   data={
      name: document.getElementById('name').value
   }
   $.ajax({
      url: "https://open-invite-ku.herokuapp.com/event",
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
