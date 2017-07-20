
/* Comments */


var npc1_1 = new NPC("npc1_1", 450,450,40, 40, "black", "Hi", ["chat1", "chat2", "chat3"]);

function NPC (id, xPos1, yPos1, xPos2, yPos2, colour, greeting, dialogue) {
    this.type = "NPC";
    this.id = id;    
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.colour = colour;
    this.greeting = greeting;   //Greeting is auto chat, triggered on contact (rather than button press). Set to "none" if no greeting required.
    this.dialogue = dialogue;           //Array passed in 
    this.chatPosition = 0;      //Track where conversation is

    this.greet = function(){
        if (this.greeting.toUpperCase() != "NONE"){
            console.log(this.greeting);
        }
    };


    //Button press fires, checks thor_next_to, if next to type NPC, find out which NPC, 
    //then search current tiles NPC's for active one, then shift one on array counter


    /*
    //Find from til
    this.chat = function(){
        console.log(this.dialogues[0]);
    };
    */
    
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos1,this.yPos1,this.xPos2,this.yPos2); 
        ctx.fill();
    };

}



function npcButtonChat(){
    //console.log(thor_next_to);
    //Using the C 'chat' key
    //T is 84 if people prefer 'talk'

    if (keys[67]) {
        console.log("Pressed Once");
        
        for (var i=0; i<thor.currentTile.npcs.length; i++) {
            //console.log("Next to: " +thor_next_to);
            //console.log(thor.currentTile.npcs[i].id);
            
            //Use dialogue associated with the NPC Thor is next to
            if (thor.currentTile.npcs[i].id == thor_next_to){

                //check to see if dialogue has been used up for this exchange
                if (thor.currentTile.npcs[i].dialogue.length == thor.currentTile.npcs[i].chatPosition) {

                    console.log("We've chatted quite enough for now sonny jim, now on your way!");
                    break;

                }
                else {
                    //Cycle through dialogue on button press
                    console.log(thor.currentTile.npcs[i].dialogue[thor.currentTile.npcs[i].chatPosition]);
            
                    //Move to next peice of dialogue
                    //Chat position stored in NPC object so not lost at function completion
                    thor.currentTile.npcs[i].chatPosition += 1;

                    break;

                }

            }
        }
    }
}















