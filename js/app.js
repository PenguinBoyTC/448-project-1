
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
         console.log("success")
         dataType: "json"
      },
   })
   document.getElementById('name').value = ""
}

document.getElementById("btn").addEventListener("click", createEvent);