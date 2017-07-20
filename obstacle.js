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



function Item (id, xPos1, yPos1, xPos2, yPos2, colour) {
    this.type = "Item";
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


function Character (id, xPos1, yPos1, xPos2, yPos2, colour) {
    this.type = "Character";
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

function NPC (id, xPos1, yPos1, xPos2, yPos2, colour, chatInit, chat) {
    this.type = "NPC";
    this.id = id;    
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.colour = colour;
    this.chatInitiation = "auto"; //Auto (On hit) or Invoke (on button press)
    this.chat = chat;            //Array passed in 
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos1,this.yPos1,this.xPos2,this.yPos2); 
        ctx.fill();
        };
}



/*
    This function obtains the obstacles on the current tile, and then iterates through them, working out the area of each object in 
    turn on the tile and then checks to see if Thor is within it. If Thor is within an obstacle it will return true, and the return 
    value is used within the thor_movement() function.
*/

/*
function thorObstacleCollide(){
    var tile = thor.currentTile;
    for (var i=0; i<tile.obstacles.length; i++) {       
            //console.log("Thor xPos" +thor.xPos);
            //console.log("xPos1: " + tile.obstacles[i].xPos1);
            //console.log("xPos2: " + tile.obstacles[i].xPos2); 
        if ((thor.xPos >= (tile.obstacles[i].xPos1 -thor.dispSize) && (thor.xPos <= (tile.obstacles[i].xPos1 + tile.obstacles[i].xPos2))) &&
        
        (thor.yPos <= ((tile.obstacles[i].yPos1 + tile.obstacles[i].yPos2)) && (thor.yPos >= (tile.obstacles[i].yPos1 - thor.dispSize)))){
            //console.log("collision alert");
            return true;
        }

    }
}
*/

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

       //create seperate functions if using below

        if ((thor.xPos >= (currentTileThingsArrays[i].xPos1 -thor.dispSize) && (thor.xPos <= (currentTileThingsArrays[i].xPos1 + currentTileThingsArrays[i].xPos2))) &&
            (thor.yPos <= ((currentTileThingsArrays[i].yPos1 + currentTileThingsArrays[i].yPos2)) && (thor.yPos >= (currentTileThingsArrays[i].yPos1 - thor.dispSize)))){

            if (currentTileThingsArrays[i].type == "Obstacle"){
                console.log("Oi, stopping hitting me against OBSTACLE named '" + currentTileThingsArrays[i].id + "'");
                //recorded for use with button press activities
                thor_next_to = currentTileThingsArrays[i].id;
            }
            else if (currentTileThingsArrays[i].type == "Item"){
                console.log("Oooooh! Whats this ITEM? I see its item '" + currentTileThingsArrays[i].id + "' though");
                //recorded for use with button press activities
                thor_next_to = currentTileThingsArrays[i].id;                
            }
            /*
            else if (currentTileThingsArrays[i].type == "Character"){
                console.log("Hmmm, who's this CHARACTER?? I notice I can track him by his secret name '" + currentTileThingsArrays[i].id + "'");
                //recorded for use with button press activities
                thor_next_to = currentTileThingsArrays[i].id;                
            }
            */

            else if (currentTileThingsArrays[i].type == "NPC"){
                console.log("Hmmm, who's this NPC?? I notice I can track him by his secret name '" + currentTileThingsArrays[i].id + "'");
                                
                //Greet right away, no button press required
                //Use 'none' in NPC constructor to have no greeting
                currentTileThingsArrays[i].greet();

                //Recorded for use with button press activities
                thor_next_to = currentTileThingsArrays[i].id; 
                //console.log(thor_next_to);
            }
        //This return is required by the thor_movement() function to determin if Thor can move or not
        return true;
        
        }
        else{
            //console.log("Not hitting anything");
            thor_next_to = "nothing";
            //console.log(thor_next_to);            
            
            //if you've moved away from an NPC, reset the dialogue poition to zero for that NPC
            currentTileThingsArrays[i].chatPosition = 0;

        }
    }
}









