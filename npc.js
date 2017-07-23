
//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var npcChatOK;


/* 
	None Playable CHaracter (NPC) Constructor

	Noteworthy elements:
			greeting: A message output by NPC when Thor is next to them.
					- If an NPC which needs conversation invoked is desired, use the keyword 'None' in the constructor to omit a greeting.
			dialogue: Should be an array of JS objects in the form {speaker: "xyz", speech: "abc"}.
					- if speaker npc then use npc in constructor and the npc ID property will be used, anything else assumes Thor is speaking.
		chatPosition: Tracks the current position in the dialogue array, is reset when a Thor moves away from an NPC.
*/

function NPC (id, xPos, yPos, width, height, colour, greeting, dialogue) {
    this.type = "NPC";
    this.id = id;    
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.greeting = greeting;
    this.dialogue = dialogue;
    this.chatPosition = 0;

    this.greet = function(){
        if (this.greeting.toUpperCase() != "NONE"){
            console.log(this.greeting + " I am " + this.id.toUpperCase());
        }
    };

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height); 
        ctx.fill();
    };
}



document.body.addEventListener("keydown", function(e) {
    //Using the C 'chat' key
    //T is 84 if people prefer 'talk'
	if (e.keyCode == 67) {
		npcChatOK = true;
	}
});



/* 
	npcButtonChat Function

	When the C button is pressed and Thor is next to a NPC then the chat of the NPC he is next to is invoked, the chat resets when 
	Thor moves away from the NPC.

*/
function npcButtonChat(){
    //console.log(thor_next_to);

    if (npcChatOK) {

		//Looping through each NPC listed in the current tile 
        for (var i=0; i<thor.currentTile.npcs.length; i++) {
          
            //If Thor next to any of them, if so refer to that NPC's dialogue
            if (thor.currentTile.npcs[i].id == thor_next_to){

                //check to see NPC's dialogue has been used up for this exchange
                if (thor.currentTile.npcs[i].dialogue.length == thor.currentTile.npcs[i].chatPosition) {

                    //Not sure if this is required but could have a general game msg which tells user that is end of convo, can be binned easily if not required
                    //Console.log to be replaced once output destination is confirmed
                    console.log("End of chat, is this bit of detection code needed as everything could be loaded into original speech array??");

                    //Stop executing for loop as any additional loops 
                    //are a waste after finding required NPC
                    break;
                }
                else {
	
    				//Cycle through the current NPC chat using the chatPosition variable
                    if (thor.currentTile.npcs[i].dialogue[thor.currentTile.npcs[i].chatPosition].speaker.toUpperCase() == "NPC"){
                    
                    	//Console.log to be replaced once output destination is confirmed
                    	console.log(thor.currentTile.npcs[i].id.toUpperCase() + ": " +                    
                   		thor.currentTile.npcs[i].dialogue[thor.currentTile.npcs[i].chatPosition].speech);
                    }
                    else{
                    	//Console.log to be replaced once output destination is confirmed
                    	console.log("THOR: " + thor.currentTile.npcs[i].dialogue[thor.currentTile.npcs[i].chatPosition].speech);
                	}
                	//shift chat pointer +1 ready for next button press
                    thor.currentTile.npcs[i].chatPosition += 1;

                    //Stop executing for loop as any additional loops 
                    //are a waste after finding required NPC
                    break;
                }
            }
        }
    }
    npcChatOK = false;
}











