var pageDate = window.location.href
var res = pageDate.split('/')
pageDate = res[4]
console.log(pageDate);
getTimes("4,5,9,10,47");

//array created to hold all the day's events
var daysEvents = [];

//uses server to get all the events on the date of the page
$.ajax({
      url: "http://localhost:8080/date/"+pageDate,
      method: "GET",
      dataType: "json",
      success: function(serverEventsArr){
         daysEvents = serverEventsArr;
      },
      
   })
   
drawEvents();

//This method puts all the events in daysEvents onto the page   
//pre: daysEvents is filled with all events on the page's date
//post: returns undefined
function drawEvents()
{
	for(let events in daysEvents)
	{
		//TODO: fancy DOM editting magic to make this look better
		document.write(events.name + "\n");
		document.write("\t"+getTimes(events.blocks)+"\n\n");
	}
}

//function that converts blocks into times
//pre: timeBlocks is formatted correctly: non-negative numbers separated by commas, ordered from least to greatest
//post: returns string that says times
function getTimes(timeBlocks)
{
	let blocksArr = [];
	let outputString;
	
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
		blocksArr.push(temp);
	
	//blocksArr is now full, so outputString can now be constructed
}

//converts given block string to 12-hour time string
//pre: block is string of a number between 0 and 47
//post: returns converted string
function blocksConversion(block)
{
	let temp = "";
	//if block/2 is zero, that means it's 12am or 12:30am, so add 12 to temp
	if(block.parseInt()/2===0)
		temp = temp + "12";
	//else if block>26, that means block/2 is more than 12, so we subtract 12 from it and add it to temp
	else if(block.parseInt()>=26)
		temp = temp + (block.parseInt()/2-12);
	//else we just add block/2 to temp
	else
		temp = temp + (block.parseInt()/2);
	
	//then, if block is odd, that means it represents a :30 time, otherwise it represents a :00 time
	if(block.parseInt()%2===1)
		temp = temp + ":30";
	else
		temp = temp + ":00";
	
	//adds am to blocks before and including 11:30am, adds pm to those after
	if(blocks.parseInt()>23)
		temp = temp + "pm";
	else
		temp = temp + "am";
	return temp;
}
