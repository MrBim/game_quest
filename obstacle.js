/*
        Obstacle constructor:
            Takes in a start x, y co-ordinate to start rectangle, then a second x position to draw out to the left and a second y to draw DOWN
            Takes in a colour argument for the fill colour

            It also contains a draw function to draw the rectangle invoked via the drawBackground() function.

        Lists of possible checks:
         - obstacle needs to be on side of walls
         - obstacle cannot be placed on top of another
         - obstacle cannot be placed infront of a door (need a threshold distance)
*/


function Obstacle (id, xPos, yPos, width, height, colour) {
    this.type = "Obstacle";
    this.id = id; 
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height); 
        ctx.fill();
    };
}


/*
    Note: Object is used here to determine an obstacle, item or character.

    This is function is passed an array objects with xPos1, yPos1, xPos2, yPos2 co-ordinates and will iterate through
    them and decide if Thor is going to hit them or not. 

    Once it has hit an object it can determine (though the objects 'type' property) the type of object, also an ID element has been added to enable
    tracking of individual objects, this may or may not be useful going forwards.

    Couldn't think of a better word than 'things' to encapsulate obstacles, items and characters, lol - if you do, please update below!
*/
function hitDetection(mover, thingsToAvoid){    
    for (var i=0; i<thingsToAvoid.length; i++) {      

        // need to skip detection of an enemy against itself, or it will never move!
        // same for Thor hitting himself!
        if (thingsToAvoid[i] == mover) {
            continue;
        }
        
        if (mover.xPos > (thingsToAvoid[i].xPos -mover.width) && 
            mover.xPos < (thingsToAvoid[i].xPos + thingsToAvoid[i].width) &&
            mover.yPos < (thingsToAvoid[i].yPos + thingsToAvoid[i].height) && 
            mover.yPos > (thingsToAvoid[i].yPos - mover.height)) {

            if (thingsToAvoid[i].type == "enemy" || thingsToAvoid[i] == thor){
                // space left for code to remove health from Thor, or whatever
                // the following is just an example:
                thor.health--;
            }
            
            if (thingsToAvoid[i].type == "Obstacle"){
            }
            else if (thingsToAvoid[i].type == "Item" && mover == thor){
                console.log("Item '" + thingsToAvoid[i].id + "' detected");
                //recorded for use with button press activities (so Thor knows what item is being picked up)
                thor_next_to = thingsToAvoid[i].id;                
            }
        
            else if (thingsToAvoid[i].type == "NPC" && mover == thor){
                //Greet right away, no button press required
                //Use 'None' in NPC constructor to have no greeting
                thingsToAvoid[i].greet();
                
                //Recorded for use with button press activities (so the right NPC chat is invoked)
                thor_next_to = thingsToAvoid[i].id; 
            }
            //This return is required by the thor_movement() function to determin if Thor can move or not
            return true;
        
        }
        else if (mover == thor){
            //Resetting when not near anything to ensure correct detection
            thor_next_to = "nothing";
            
            //if you've moved away from an NPC, reset the dialogue position to zero for that NPC
            thingsToAvoid[i].chatPosition = 0;
        }
    }
}









