/**
*	@Function	getPeopleArray
*	This function formats the string of event participants. It takes all the user
*	information for an event and converts it.
*	
*	@pre 		peopleString - Is properly formatted from the database.  
*	@post		Returns an array of formatted participants’ data
*	@since	September 17, 2017
*
*/

function getPeopleArray(peopleString)
{
   //peopleArr is an array of objects with properties name and availableTimeBlocks
   let peopleArr = [];
   
   //UnparsedArr is an array of strings that say the participant's name and available time blocks, all separated by commas
   let peopleUnparsedArr = [];
   let temp = "";
   
   for(let i=0;i<peopleString.length;i++)
   {
      //if the current character is an underscore, look for another one next, else concatenate temp with current character
      if(peopleString.charAt(i)=="_")
      {
         if(peopleString.charAt(i+1)=="_")
         {
            //push temp to peopleArr
            peopleUnparsedArr.push(temp);
            
            //reset temp
            temp = "";
            
            //iterate i extra since we already know that i+1 is an underscore and to avoid array out of bounds at end of string
            i++;
         }
         else
            temp = temp + peopleString.charAt(i);
      }
      else
         temp = temp + peopleString.charAt(i);
   }
   
   //now, peopleUnparsedArr is assembled, so each string is parsed and broken down further
   for(let j=0;j<peopleUnparsedArr.length;j++)
   {
      let parseTemp = "";
      let personObj = {
         name: "",
         availableTimeBlocks: ""};
      let nameFound = false;
      let person = peopleUnparsedArr[j];
      
      //parsing persom string
      for(let i=0;i<person.length;i++)
      {
         //for the first comma it finds, it sets personObj's name property and resets parseTemp.
         //everything after the name is found is concatenated into parseTemp
         if(!nameFound&&person.charAt(i)==",")
         {
            personObj.name = parseTemp;
            parseTemp = "";
            nameFound = true;
         }
         else
            parseTemp = parseTemp + person.charAt(i);
      }
      //second part of string formatted by getTimes, then added into availableTimeBlocks property
      personObj.availableTimeBlocks = getTimes(parseTemp);
      //personObj gets added to the array peopleArr
      peopleArr.push(personObj);
   }
   
   return peopleArr;
}

/**
*	@Function	getTimes
*	This function takes each time block and formats that information into actual times
*	to be used for the event. 
*	
*	@pre 		timeBlocks is formatted correctly: non-negative numbers separated by 
*			commas,ordered from least to greatest
*	@post		returns string that says times
*	@since	September 17, 2017
*
*/

{
   let blocksArr = [];
   let outputString = "";
   
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
      blocksArr.push(parseInt(temp));
   
   //blocksArr is now full, so outputString can now be constructed
   for(let i=0;i<blocksArr.length;i++)
   {
      //if it's the start block for a given set of consecutive blocks, write the start time
      if(i===0||blocksArr[i]!=(parseInt(blocksArr[i-1])+1))
      {
         outputString = outputString + blocksConversion(parseInt(blocksArr[i]))+" - ";
      }
      //if it's the end block for a given set of consecutive blocks, write the end time
      if(i===blocksArr.length||blocksArr[i]!=(parseInt(blocksArr[i+1])-1))
      {
         outputString = outputString + blocksConversion(parseInt(blocksArr[i])+1);
         //if it's not the last block, put a comma to separate times
         if(i!==blocksArr.length-1){
            outputString = outputString + ", ";
         }
      }
   }
   
   return outputString;
}
/**
*	@Function	blockConversion
*	This function takes given block string and converts that into the 12 hour time. 
*	
*	@pre		block is a number between 0 and 48
*	@post		returns converted string
*	@since	September 17, 2017
*
*/

var blocksConversion = function(block)
{
   let temp = "";
   
   //in the event that the event ends at midnight, read midnight as block 0, not block 48
   if(block==48)
      block = 0;
   
   if(militaryTime)
   {
      if(block/2<10)
         temp = temp + "0";
      temp = temp + Math.floor(block/2);
      //then, if block is odd, that means it represents a :30 time, otherwise it represents a :00 time
      if(block%2===1)
         temp = temp + ":30";
      else
         temp = temp + ":00";
   }
   else
   {
      //if block/2 is zero, that means it's 12am or 12:30am, so add 12 to temp
      if(Math.floor(block/2)===0)
         temp = temp + "12";
      //else if block>26, that means block/2 is more than 12, so we subtract 12 from it and add it to temp
      else if(block>=26)
         temp = temp + Math.floor((block/2-12));
      //else we just add block/2 to temp
      else
         temp = temp + Math.floor((block/2));
      
      //then, if block is odd, that means it represents a :30 time, otherwise it represents a :00 time
      if(block%2===1)
         temp = temp + ":30";
      else
         temp = temp + ":00";
      
      //adds am to blocks before and including 11:30am, adds pm to those after
      if(block>23)
         temp = temp + "pm";
      else
         temp = temp + "am";
   }
   return temp;
}