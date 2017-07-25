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


function Sword (xPos1, yPos1, pic) {
    this.pic = pic;
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.draw = function() {
        ctx.beginPath();
        ctx.drawImage(this.pic, this.xPos, this.yPos, 40, 40);
        ctx.closePath();
        };
}

function Obstacle (xPos1, yPos1, xPos2, yPos2, colour) {
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
    This function obtains the obstacles on the current tile, and then iterates through them, working out the area of each object in 
    turn on the tile and then checks to see if Thor is within it. If Thor is within an obstacle it will return true, and the return 
    value is used within the thor_movement() function.
*/
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


/*
    This is development phase function which can be passed in an array objects with xPos1, yPos1, xPos2, yPos2 co-ordinates and will iterate through
    them and decide if Thor is going to hit them or not. This means that potentially Obstacles, NPC's or Items can use this function, the array just
    needs to be passed in as per the obstacles array.

    The array passed in can be tested to see what object type (Obstacles, NPC or Items) are being assessed

    IF each object had a type (NPC, item etc) could it be found out WHAT Thor has bumped into?? How can this be done?? 
    I guess the location of the found object, as it loops though it will make a match on one item within the different arrays it
    cycles through (obstacles, NPC, items) etc, if each item had a property or type, that coul dbe picked out, then based on that a subsequent action
    function could be kicked off, such as a speech function for NPC or pick up and bag/inventory for item.

function thorHitDetection(currentTileInfo){
    //var tile = thor.currentTile;
    for (var i=0; i<currentTileInfo.length; i++) {      
            //console.log("Thor xPos" +thor.xPos);
            //console.log("xPos1: " + tile.obstacles[2].xPos1);
            //console.log("xPos2: " + tile.obstacles[2].xPos2); 

        if ((thor.xPos >= (currentTileInfo[i].xPos1 -thor.dispSize) && (thor.xPos <= (currentTileInfo[i].xPos1 + currentTileInfo[i].xPos2))) &&
        
        (thor.yPos <= ((currentTileInfo[i].yPos1 + currentTileInfo[i].yPos2)) && (thor.yPos >= (currentTileInfo[i].yPos1 - thor.dispSize)))){
        
            if (currentTileInfo === thor.currentTile.obstacles){
                console.log("obstacles hit alert");

            }
        
        return true;
        
        }
    }
}
*/




