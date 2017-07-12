/*

    Put in lists of checks
     - Obsticle needs to be on side of walls
     - Obsticle cannot be placed on top of another
     - Obsticle cannot be placed ?? spaces infront of a door

    Need to get rectangle middle
    Then 20 pix anyside of that is Thor collison point

    Collision Up
    Collision Down etc

    Function hasCollided(direction){
        //for up
        if Thor next Y2 == Obsticle Y1
            AND
        if Thor X2 between Obsticle X1 and X2 (In ramge set by obsticle params)
        COLLISION

    
    ---------------
    Then, IF hasCollided is ever true, only do animation, don't do move

*/
function Obsticle (xPos1, yPos1, xPos2, yPos2, colour) {
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.middleX = (xPos1 + xPos2)/2;
    this.middleY = (yPos1 + yPos2)/2;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.lineWidth="6";
        ctx.fillStyle=this.colour;
        //       x,y -> x,y
        ctx.rect(this.xPos1,this.yPos1,this.xPos2,this.yPos2); 
        ctx.fill();
        }
}


//collision detection
function hasCollided(direction){

}





