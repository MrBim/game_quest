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


