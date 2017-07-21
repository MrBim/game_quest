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


function Obstacle (id, xPos1, yPos1, xPos2, yPos2, colour) {
    this.type = "Obstacle";
    this.id = id; 
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos1,this.yPos1,this.xPos2,this.yPos2); 
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
function thorHitDetection(currentTileThingsArrays){    
    for (var i=0; i<currentTileThingsArrays.length; i++) {      

        if ((thor.xPos >= (currentTileThingsArrays[i].xPos1 -thor.dispSize) && (thor.xPos <= (currentTileThingsArrays[i].xPos1 + currentTileThingsArrays[i].xPos2))) &&
            (thor.yPos <= ((currentTileThingsArrays[i].yPos1 + currentTileThingsArrays[i].yPos2)) && (thor.yPos >= (currentTileThingsArrays[i].yPos1 - thor.dispSize)))){

            if (currentTileThingsArrays[i].type == "Obstacle"){
            }
            else if (currentTileThingsArrays[i].type == "Item"){
                console.log("Item '" + currentTileThingsArrays[i].id + "' detected");
                //recorded for use with button press activities (so Thor knows what item is being picked up)
                thor_next_to = currentTileThingsArrays[i].id;                
            }
        
            else if (currentTileThingsArrays[i].type == "NPC"){
                //Greet right away, no button press required
                //Use 'None' in NPC constructor to have no greeting
                currentTileThingsArrays[i].greet();
                
                //Recorded for use with button press activities (so the right NPC chat is invoked)
                thor_next_to = currentTileThingsArrays[i].id; 
            }
        //This return is required by the thor_movement() function to determin if Thor can move or not
        return true;
        
        }
        else{
            //Resetting when not near anything to ensure correct detection
            thor_next_to = "nothing";
            
            //if you've moved away from an NPC, reset the dialogue position to zero for that NPC
            currentTileThingsArrays[i].chatPosition = 0;
        }
    }
}









