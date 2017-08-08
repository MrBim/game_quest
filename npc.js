
//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var npcChatOK;


/*
    None Playable C
    this.colour = colour;Haracter (NPC) Constructor
    Noteworthy elements:
            greeting: A message output by NPC when Thor is next to them.
                    - If an NPC which needs conversation invoked is desired, use the keyword 'None' in the constructor to omit a greeting.
     currentDialogue: The dialogue script which will be used when the chatButton code executes
        dialogueList: Should be an array, of arrays containing JS objects in the form {speaker: "xyz", speech: "abc"}.
                    - if speaker npc then use npc in constructor and the npc ID property will be used, anything else assumes Thor is speaking.
        chatPosition: Tracks the current position in the dialogue array, is reset when a Thor moves away from an NPC.
           questItem: An item *object* the NPC is holding for thor to aid him on his quest - so items need creating *BEFORE* NPC's so they can be passed in
*/


// should remove all references to width and height of npc's as they will all be 40 X 40 
function NPC (id, name, xPos, yPos, width, height, colour, greeting, dialogueList, questItem) {
    this.type = "NPC";
    this.id = id;
    this.name = name;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.greeting = greeting;
    this.convoStatus = "Initial";
    this.currentDialogue = dialogueList[0];
<<<<<<< HEAD
=======

    //this.currentDialogue = [{speaker:"Thor", speech:"Blah"}, {speaker:"npc", speech:"blah"} , {speaker:"Thor", speech:"MehMoh"}, {speaker:"npc", speech:"MehMoh"}];

>>>>>>> 358ebba80995163fb32608772eaef86cde816e50
    this.dialogueList = dialogueList;
    this.questItem = questItem;
    this.chatPosition = 0;

    this.greet = function(){
        if (this.greeting.toUpperCase() != "NONE"){
            console.log(this.greeting + " I am " + this.name.toUpperCase());
            underText1 = (this.greeting );
            underText2 = ( " I am " + this.name.toUpperCase());
            underText3 = "";
            underText4 = "";
            underText5 = "";
            underText6 = "";
        }
    };
    // replace with graphic here
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
    //console.log(thor.nextToID);

    if (npcChatOK) {

        //Looping through each NPC listed in the current tile
        for (var i=0; i<thor.currentTile.npcs.length; i++) {

            //If Thor next to any of them, if so refer to that NPC's dialogue
            if (thor.currentTile.npcs[i].id == thor.nextToID){

                //check to see NPC's dialogue has been used up for this exchange
                if (thor.currentTile.npcs[i].currentDialogue.length == thor.currentTile.npcs[i].chatPosition) {

                    //Indication to user that convo have finished

                    underText1 = (thor.currentTile.npcs[i].name.toUpperCase() + ":");
                    underText2 = "We have spoken enough,";
                    underText3 = "on with your Quest!";
                    underText4 = "";
                    underText5 = "";
                    underText6 = "";

                    if (underText2 == "We have spoken enough,"){
                        underText1 = "";
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                    }

                    //Stop executing for loop as any additional loops
                    //are a waste after finding required NPC
                    break;
                }
                else {

                    //Cycle through the current NPC chat using the chatPosition variable
                    if (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speaker.toUpperCase() == "NPC"){

                        //Console.log to be replaced once output destination is confirmed

                        underText1 = (thor.currentTile.npcs[i].name.toUpperCase() + ": " )
                        underText2 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech);
                        underText3 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech1);
                        underText4 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech2);
                        underText5 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech3);
                        underText6 = "";
                    }
                    else{
                        //Console.log to be replaced once output destination is confirmed
                        underText1 = ("THOR: ")
                        underText2 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech);
                        underText3 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech1);
                        underText4 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech2);
                        underText5 = (thor.currentTile.npcs[i].currentDialogue[thor.currentTile.npcs[i].chatPosition].speech3);
                        underText6 = "";
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