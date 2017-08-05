//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var puzzlingOK;

/* 
    Puzzle constructor:
     - Takes an id
     - 
*/


/*  Test function, the obstacles need to be changed to all same colour

*/


/*
 set obstacles to random colour value taken from the arrays of blues

 add Puzzle object to both intitial and final mapTile after initalisation of Map but before game starts!


    puzzleObstacles - Obstacles which are puzzle compoents
    puzzleCode - code to be executed when puzzle attempted
    puzzleButtonObstacle - Optional button to press when puzzle code engaged with

*/


testPuzzzle = function(obstacles){

};



/* takes an obstacle in as its self, then the obstacles which will make up the puzzle, and an initial and destinationMapTile to update */

//function PuzzleButton(id, puzzleObstacles, initialMapTile, destinationMapTile){
function Puzzle(id, puzzleButton, puzzleObstacles){
    this.id = id;
    this.obstacles = obstacles;
}


function PuzzleObstacle (id, xPos, yPos, width, height, colour, puzzleCompleteVal, puzzleVals) {
    this.type = "PuzzleObstacle";
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.puzzleCompleteVal = puzzleCompleteVal;
    this.allPossibleVals = puzzleVals;
    this.puzzleSuccess = false;
    this.puzzlePointer = 0;

    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height);
        ctx.fill();
        };
}


document.body.addEventListener("keydown", function(e) {
    //Using the P 'Puzzle' key
    if (e.keyCode == 80) {
        puzzlingOK = true;
    }
});



/*
checkPuzzle Function
When the 'p' button is pressed:
if Thor is facing a puzzle obstacle (ie, one peice of a puzzle)....
if Thor is facing a puzzle button (ie, to check if puzzle complete).....
*/

function checkPuzzle() {
    if (puzzlingOK) {
        //Is Thor next to an puzzle Obstacle?
        if (thor.nextToType == "PuzzleObstacle") {
            //work out which obstacle
            for (var i = 0; i < thor.currentTile.PuzzleObstacle.length; i++) {
                //find the item within the currentTile.items array
                if (thor.currentTile.PuzzleObstacle[i].id == thor.nextToID) {

                    if (thor.currentTile.PuzzleObstacle[i].puzzleCompleteVal == thor.currentTile.PuzzleObstacle[i].allPossibleVals[thor.currentTile.PuzzleObstacle[i].puzzlePointer]){
                        thor.currentTile.PuzzleObstacle[i].puzzleSuccess = true;
                        console.log("Not solved yet! - Complete Val: " + thor.currentTile.PuzzleObstacle[i].puzzleCompleteVal);  
                        console.log("Not solved yet! - Current value: " + thor.currentTile.PuzzleObstacle[i].allPossibleVals[thor.currentTile.PuzzleObstacle[i].puzzlePointer]);
                        console.log(thor.currentTile.PuzzleObstacle[i].id + ": solved the puzzle peice!");

                                                
                        //Now go over all of the title puzzle items, if they are all set correctly then perform action!
                        var puzzleCompleted = true;
                        for (var j=0; j<thor.currentTile.PuzzleObstacle.length; j++){
                            console.log(thor.currentTile.PuzzleObstacle[j].puzzleSuccess);
                            if (thor.currentTile.PuzzleObstacle[j].puzzleSuccess === false){
                                puzzleCompleted = false;
                            }
                            break;
                        }
                        if (puzzleCompleted){
                            console.log("PUZZLE COMPLETED!");
                        }
                    }
                    else{
                        //ensure that value is correct is used if user cycles past correct value
                        thor.currentTile.PuzzleObstacle[i].puzzleSuccess = false;
                        console.log("Not solved yet! - Complete Val: " + thor.currentTile.PuzzleObstacle[i].puzzleCompleteVal);  
                        console.log("Not solved yet! - Current value: " + thor.currentTile.PuzzleObstacle[i].allPossibleVals[thor.currentTile.PuzzleObstacle[i].puzzlePointer]);
                        console.log(thor.currentTile.PuzzleObstacle[i].id + ": not solved yet!");
                    }
                    //Inc the count so player can cycle past correct value, if you want it to stop on correct value move within 'else' above
                    thor.currentTile.PuzzleObstacle[i].puzzlePointer += 1;
                    //Ensure the pointer doesn't get incremented beyond array length
                    if (thor.currentTile.PuzzleObstacle[i].puzzlePointer == thor.currentTile.PuzzleObstacle[i].allPossibleVals.length){
                        thor.currentTile.PuzzleObstacle[i].puzzlePointer = 0;
                    }


                    //No need to complete redundent cycles of for loop
                    break;
                }
            }
        }
    }
    puzzlingOK = false;
}

