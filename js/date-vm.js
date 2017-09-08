var pageDate = window.location.href
var temp = pageDate.split('/')
pageDate = temp[4]

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