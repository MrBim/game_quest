
    // Obstacle constructor:
    // ---------------------
    // Takes in a start x, y co-ordinate to start rectangle, then a second x position to draw out to the left and a second y to draw DOWN
    // Takes in a colour argument for the fill colour
    // It also contains a draw function to draw the rectangle invoked via the drawBackground() function.



function Obstacle (id, xPos, yPos, width, height, colour, questItem) {
    this.type = "Obstacle";
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.questItem = questItem;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height);
        ctx.fill();
        };
}

    // This function obtains the obstacles on the current tile, and then iterates through them, working out the area of each object in
    // turn on the tile and then checks to see if Thor is within it. If Thor is within an obstacle it will return true, and the return
    // value is used within the thor_movement() function.

//  function thorObstacleCollide(){
//     var tile = thor.currentTile;
//     for (var i=0; i<tile.obstacles.length; i++) {
//             //console.log("Thor xPos" +thor.xPos);
//             //console.log("xPos1: " + tile.obstacles[i].xPos1);
//             //console.log("xPos2: " + tile.obstacles[i].xPos2);
//         if ((thor.xPos >= (tile.obstacles[i].xPos1 -thor.dispSize) && (thor.xPos <= (tile.obstacles[i].xPos1 + tile.obstacles[i].xPos2))) &&
//         (thor.yPos <= ((tile.obstacles[i].yPos1 + tile.obstacles[i].yPos2)) && (thor.yPos >= (tile.obstacles[i].yPos1 - thor.dispSize)))){
//             //console.log("collision alert");
//             return true;
//         }
//     }
//     };
// }



    // Note: Object is used here to determine an obstacle, item or character.
    // This is function is passed an array objects with xPos1, yPos1, xPos2, yPos2 co-ordinates and will iterate through
    // them and decide if Thor is going to hit them or not.
    // Once it has hit an object it can determine (though the objects 'type' property) the type of object, also an ID element has been added to enable
    // tracking of individual objects, this may or may not be useful going forwards.
    // Couldn't think of a better word than 'things' to encapsulate obstacles, items and characters, lol - if you do, please update below!

function hitDetection(mover, thingsToAvoid, tolerance, pointingDirection){
    if (tolerance === undefined) {
        tolerance = 0;
    }
    for (var i=0; i<thingsToAvoid.length; i++) {
        // need to skip detection of an enemy against itself, or it will never move!
        // same for Thor hitting himself!
        if (thingsToAvoid[i] == mover) {
            continue;
        }

        if (mover.xPos + tolerance > (thingsToAvoid[i].xPos - mover.width) &&
            mover.xPos - tolerance < (thingsToAvoid[i].xPos + thingsToAvoid[i].width) &&
            mover.yPos - tolerance < (thingsToAvoid[i].yPos + thingsToAvoid[i].height) &&
            mover.yPos + tolerance > (thingsToAvoid[i].yPos - mover.height)) {

            // check you're pointing in the right direction (needed for thor's sword, if nothing else):
            if (pointingDirection === undefined || // but only if a direction is given!
                (pointingDirection == 1 && thingsToAvoid[i].yPos <= mover.yPos) ||
                (pointingDirection == 2 && thingsToAvoid[i].xPos <= mover.xPos) ||
                (pointingDirection == 3 && thingsToAvoid[i].yPos >= mover.yPos) ||
                (pointingDirection == 4 && thingsToAvoid[i].xPos >= mover.xPos)) {

                if ((thingsToAvoid[i].type == "enemy" && thingsToAvoid[i].alive && mover == thor
                    && hitDetection(thingsToAvoid[i],[thor])) ||  // make sure enemy can actually see thor, with no separation
                     thingsToAvoid[i] == thor && mover.alive){
                    // space left for code to remove health from Thor, or whatever
                    // the following is just an example:
                    thor.hasBeenHit = true;
                }

                else if (thingsToAvoid[i].type == "Obstacle" && mover == thor){
                    //recorded for use with button press activities (so Thor knows obstacle he is infront of)
                    thor.nextToID = thingsToAvoid[i].id;
                    thor.nextToType = thingsToAvoid[i].type;
                }

                else if (thingsToAvoid[i].type == "Item" && mover == thor){
                    //recorded for use with button press activities (so Thor knows what item is being picked up)
                    thor.nextToID = thingsToAvoid[i].id;
                    thor.nextToType = thingsToAvoid[i].type;
                }

                else if (thingsToAvoid[i].type == "NPC" && mover == thor){
                    //Greet right away, no button press required
                    //Use 'None' in NPC constructor to have no greeting
                    thingsToAvoid[i].greet();
                    //Recorded for use with button press activities (so the right NPC chat is invoked)
                    thor.nextToID = thingsToAvoid[i].id;
                    thor.nextToType = thingsToAvoid[i].type;
                }
                //This return is required by the thor_movement() function to determin if Thor can move or not
                return true;

            }
            else if (mover == thor){
                //Resetting when not near anything to ensure correct detection
                thor.nextToID = "nothing";
                thor.nextToType = "nothing";
                //if you've moved away from an NPC, reset the dialogue position to zero for that NPC
                thingsToAvoid[i].chatPosition = 0;
            }
        }
    }
}
