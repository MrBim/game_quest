//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var puzzlingOK;


/*
 set obstacles to random colour value taken from the arrays of blues

 add Puzzle object to both intitial and final mapTile after initalisation of Map but before game starts!


    puzzleObstacles - Obstacles which are puzzle compoents
    puzzleCode - code to be executed when puzzle attempted
    puzzleButtonObstacle - Optional button to press when puzzle code engaged with

*/



//Add a key object to the next tile
function puzzleCreateNewItem(item, targetMapTile) {
    targetMapTile.items.push(item);
}


function puzzleUpdateNPCConvo(npc_id, newGreeting, newConvo) {
    npc_id.greeting = newConvo;
    npc_id.dialogueList = newConvo;
    npc_id.chatPosition = 0;
}

function puzzleUnlockDoor(door_id) {

}

//Add a key object to the next tile




/* takes an obstacle in as its self, then the obstacles which will make up the puzzle, and an initial and destinationMapTile to update */


function PuzzlePeice(id, xPos, yPos, width, height, colour, puzzleCompleteVal, puzzleValRange) {
    this.type = "PuzzlePeice";
    this.id = id;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.puzzleCompleteVal = puzzleCompleteVal;
    this.allPossibleVals = puzzleValRange;
    this.puzzleSuccess = false;
    this.puzzlePointer = Math.floor((Math.random() * (this.allPossibleVals.length - 1)) + 0);
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.rect(this.xPos, this.yPos, this.width, this.height);
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
        if (thor.nextToType == "PuzzlePeice") {
            //work out which obstacle
            for (var i = 0; i < thor.currentTile.PuzzlePeices.length; i++) {
                //find the item within the currentTile.items array
                if (thor.currentTile.PuzzlePeices[i].id == thor.nextToID) {

                    //If a colour is defined in original instantiation of object, it is assumed colour is to be cycled
                    if (thor.currentTile.PuzzlePeices[i].colour != undefined) {
                        console.log(thor.currentTile.PuzzlePeices[i].puzzlePointer);
                        thor.currentTile.PuzzlePeices[i].colour = thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer];
                    } else if (1 === 0) {
                        //A deliberate false above as this is just a placeholder for expected future code.
                        //This is the code to cater for cycling images if puzzle obstacle instantiated with an image.
                    }


                    if (thor.currentTile.PuzzlePeices[i].puzzleCompleteVal == thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer]) {
                        thor.currentTile.PuzzlePeices[i].puzzleSuccess = true;
                        console.log("Solved!!!! - Complete Val: " + thor.currentTile.PuzzlePeices[i].puzzleCompleteVal);
                        console.log("Solved!!!! - Current value: " + thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer]);
                        console.log(thor.currentTile.PuzzlePeices[i].id + ": solved the puzzle peice!");


                        //Now go over all of the title puzzle items, if they are all set correctly then perform action!
                        var puzzleCompleted = true;
                        for (var j = 0; j < thor.currentTile.PuzzlePeices.length; j++) {
                            console.log(thor.currentTile.PuzzlePeices[j].puzzleSuccess);
                            if (thor.currentTile.PuzzlePeices[j].puzzleSuccess === false) {
                                puzzleCompleted = false;
                            }
                        }


                        if (puzzleCompleted) {
                            thor.currentTile.PuzzleComplete = true;
                            console.log("PUZZLE COMPLETED! - KICKING OFF SUPPLIED PUZZLE FUNCTION!");

                            //Wall alert flash
                            var backgroundAlert = thor.currentTile.colour;
                            console.log("Background Alert: " + backgroundAlert);
                            thor.currentTile.colour = "#ffff";
                            window.setTimeout(function(){
                                    thor.currentTile.colour = backgroundAlert;
                                }, 250);

                            //is an item place required?
                            if (thor.currentTile.hasOwnProperty("itemToPlace")) {
                                //Assume rest of properties filel di correctly?
                                console.log(thor.currentTile.targetMapTile);
                                console.log(thor.currentTile.itemToPlace);                                
                                thor.currentTile.targetMapTile.items.push(thor.currentTile.itemToPlace);
                            } else if (1 == 0) {

                            } else if (1 == 0) {

                            }
                        }
                    } else {
                        //ensure that value is correct is used if user cycles past correct value
                        thor.currentTile.PuzzlePeices[i].puzzleSuccess = false;
                        console.log("Not solved yet! - Complete Val: " + thor.currentTile.PuzzlePeices[i].puzzleCompleteVal);
                        console.log("Not solved yet! - Current value: " + thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer]);
                        console.log(thor.currentTile.PuzzlePeices[i].id + ": not solved yet!");
                    }

                    //If the puzzle is complete then don't let obstacles cycle through anymore
                    if (!thor.currentTile.PuzzleComplete) {
                        thor.currentTile.PuzzlePeices[i].puzzlePointer += 1;

                        //Ensure the pointer doesn't get incremented beyond array length
                        if (thor.currentTile.PuzzlePeices[i].puzzlePointer == (thor.currentTile.PuzzlePeices[i].allPossibleVals.length - 1)) {
                            thor.currentTile.PuzzlePeices[i].puzzlePointer = 0;
                        }
                    }

                    //No need to complete redundent cycles of for loop
                    break;
                }
            }
        }
    }
    puzzlingOK = false;
}