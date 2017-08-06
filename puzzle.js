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
        if (thor.nextToType == "PuzzlePeice" && thor.currentTile.PuzzleComplete === false) {
            //work out which obstacle
            for (var i = 0; i < thor.currentTile.PuzzlePeices.length; i++) {
                //find the item within the currentTile.items array
                if (thor.currentTile.PuzzlePeices[i].id == thor.nextToID) {

                    //If a colour is defined in original instantiation of object, it is assumed colour is to be cycled
                    if (thor.currentTile.PuzzlePeices[i].colour != undefined) {
                        thor.currentTile.PuzzlePeices[i].colour = thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer];
                    } else if (1 === 0) {
                        //A deliberate false above as this is just a placeholder for expected future code.
                        //This is the code to cater for cycling images if puzzle obstacle instantiated with an image.
                    }


                    if (thor.currentTile.PuzzlePeices[i].puzzleCompleteVal == thor.currentTile.PuzzlePeices[i].allPossibleVals[thor.currentTile.PuzzlePeices[i].puzzlePointer]) {
                        thor.currentTile.PuzzlePeices[i].puzzleSuccess = true;
                        //Now go over all of the title puzzle items, if they are all set correctly then perform action!
                        var puzzleCompleted = true;
                        for (var j = 0; j < thor.currentTile.PuzzlePeices.length; j++) {
                            if (thor.currentTile.PuzzlePeices[j].puzzleSuccess === false) {
                                puzzleCompleted = false;
                            }
                        }


                        if (puzzleCompleted) {
                            thor.currentTile.PuzzleComplete = true;
                            console.log("PUZZLE COMPLETED! - KICKING OFF SUPPLIED PUZZLE FUNCTION!");

                            //Wall alert flash to let player know puzzle complete
                            var backgroundAlert = thor.currentTile.colour;
                            thor.currentTile.colour = "#ffff";
                            window.setTimeout(function(){
                                    thor.currentTile.colour = backgroundAlert;
                                }, 250);

                            //Is an item being placed?
                            if (thor.currentTile.hasOwnProperty("itemToPlace")) {
                                thor.currentTile.targetMapTile.items.push(thor.currentTile.itemToPlace);
                    

                            } 
                            //Does NPC chat need to be updated?
                            if (thor.currentTile.hasOwnProperty("newChatNPC_id")) {
                                //find out which NPC
                                for (var k = 0; k < thor.currentTile.npcs.length; k++) {
                                    if (thor.currentTile.npcs[k].id == thor.currentTile.newChatNPC_id) {
                                        thor.currentTile.npcs[k].currentDialogue = thor.currentTile.npcs[k].dialogueList[2];
                                        //start any new dialogue from beginning, irrispective of where last one finished
                                          thor.currentTile.npcs[k].chatPosition = 0;
                                    }
                                }
                            }                            
                           
                            //Is key being handed over? Then unlock the door on the tile
                            for (var m = 0; m < thor.currentTile.items.length; m++) {
                               //if its a key, unlock door key is for
                               if (thor.currentTile.items[m].id == "key") {
                                  thor.currentTile.items[m].unlocks.locked = false;
                               }
                            }
                        }
                    } else {
                        //ensure that value is correct is used if user cycles past correct value
                        thor.currentTile.PuzzlePeices[i].puzzleSuccess = false;
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