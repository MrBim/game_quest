//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var itemObtainingOK, obstacleInteraction;


//    Item constructor
// Noteworthy elements:
// id: The ID is deemed the unique identifier for the item on any tile.
// name: items in game name (eg "Magic Key"), you can have more than 1 item of the same name on the current tile.



function Item(id, name, xPos, yPos, width, height, colour) {
    this.type = "Item";
    this.id = id;
    this.name = name;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.rect(this.xPos, this.yPos, this.width, this.height);
        ctx.fill();
    };
}

function picItem(id, name, sprite, xPos, yPos, width, height, colour) {
    this.type = "Item";
    this.id = id;
    this.name = name;
    this.sprite = sprite;
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.drawImage(this.sprite, this.xPos, this.yPos, this.width, this.height);
        ctx.closePath();
    };
}


document.body.addEventListener("keydown", function(e) {
    //Using the A key
    if (e.keyCode == 65) {
        itemObtainingOK = true;
        obstacleInteraction = true;
    }
});


/*
obtainItem Function
When the 'I' button is pressed:
if Thor is facing an on screen item he will pick it up (it is put in his inventory and be removed from the display/tile)
if Thor is next to a NPC the item they have for him will be placed in his inventory
if thor is not facing an Item or NPC the inventory will be listed
The function places each complete Item object into Thors items array each time (rather than just the name of it), the intention of this is that
all/any Item properties can be interrogated with greater ease by other functions simply by accessing Thors items array, a futureproofing move if
nothing else :-)
*/

function obtainItem() {
    if (itemObtainingOK) {
        //Is Thor next to an item?
        if (thor.nextToType == "Item") {
            //work out which item
            for (var i = 0; i < thor.currentTile.items.length; i++) {
                //find the item within the currentTile.items array
                if (thor.currentTile.items[i].id == thor.nextToID) {
                    // increase health to 100 if powerup taken
                    if (thor.nextToID == "powerup") {
                        thor.health = 100;
                        console.log("Yummy powerup!");

                        underText1 = "Yummy powerup!";
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                    } else {
                        //add it to Thors inventory
                        thor.items.push(thor.currentTile.items[i]);
                        console.log(thor.currentTile.items[i].name + ": added to Thors inventory");
                        underText1 = (thor.currentTile.items[i].name + ": added to Thors inventory");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                        //change NPC chat if required, loop through each and update a required
                        for (var k = 0; k < thor.currentTile.npcs.length; k++) {
                            if (typeof thor.currentTile.npcs[k].dialogueList[1] !== 'undefined') {
                                thor.currentTile.npcs[k].currentDialogue = thor.currentTile.npcs[k].dialogueList[2];
                                thor.currentTile.npcs[k].chatPosition = 0;
                            }
                        }
                        //if its a key, unlock door key is for
                        if (thor.currentTile.items[i].id == "key") {
                            thor.currentTile.items[i].unlocks.locked = false;
                        }
                    }

                    //remove it from the current tile
                    thor.currentTile.items.splice(i, 1);

                    //enable inventory to be shown directly after pick up, without need to move
                    thor.nextToID = "nothing";
                    thor.nextToType = "nothing";

                    //No need to complete redundent cycles of for loop
                    break;

                }
            }
        }
        //Is Thor next to an NPC?
        else if (thor.nextToType == "NPC") {
            //work out which NPC
            for (var j = 0; j < thor.currentTile.npcs.length; j++) {
                //find the npc within the currentTile.items array
                if (thor.currentTile.npcs[j].id == thor.nextToID) {
                    //does the NPC have a questItem

                    if (thor.currentTile.npcs[j].questItem === undefined) {
                        console.log(thor.currentTile.npcs[j].name.toUpperCase() + ": Sorry, nothing to give you, onwards with your quest!");
                        underText1 = (thor.currentTile.npcs[j].name.toUpperCase() + ": Sorry, nothing to give you, onwards with your quest!");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                        //NPC - nothing to give convo
                    } else if (thor.items.indexOf(thor.currentTile.npcs[j].questItem) == -1) {
                        //if Thor doesn't already have item, add the whole object
                        thor.items.push(thor.currentTile.npcs[j].questItem);
                        console.log(thor.currentTile.npcs[j].questItem.name + ": added to Thors inventory");
                        underText1 = (thor.currentTile.npcs[j].questItem.name + ": added to Thors inventory");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                        if (thor.currentTile.npcs[j].questItem.id == "key") {
                            //console.log("State 1: " + thor.currentTile.npcs[j].questItem.id);            					
                            thor.currentTile.npcs[j].questItem.unlocks.locked = false;
                            //console.log("State 2: " + thor.currentTile.items[m].unlocks.locked);	                            
                        }


                        /*
                                  				console.log("current tile id: " +thor.currentTile.id + " length: " + thor.currentTile.items.length);
                                                //if thor is being given a key, unlock door{
                                    			for (var m = 0; m < thor.currentTile.items.length; m++) {                        	
                                    				console.log("All items: " + thor.currentTile.items[m].id);
                                                	if (thor.currentTile.items[m].id == "key") {
                                    					console.log("State 1: " + thor.currentTile.items[m].unlocks.locked);
                        	                            thor.currentTile.items[m].unlocks.locked = false;
                                    					console.log("State 2: " + thor.currentTile.items[m].unlocks.locked);	                            
                        	                        }
                                                }
                        */



                        //Updating the NPC's conversation array based on
                        if (thor.currentTile.npcs[j].convoStatus == "Initial") {
                            //Make sure the NPC has a secondary conversation set up, if so use it
                            if (thor.currentTile.npcs[j].dialogueList.length > 1) {
                                //Move the array to point to the next item
                                thor.currentTile.npcs[j].currentDialogue = thor.currentTile.npcs[j].dialogueList[1];
                                //start at the beginning of the array
                                thor.currentTile.npcs[j].chatPosition = 0;
                                //Update NPC for next convo
                                thor.currentTile.npcs[j].convoStatus = "Given";
                            }
                        }
                        /*
                        else if (convoStatus == "Given" && thor.currentTile.npcs[i].id == <specificNPC> ){
                         Specific use cases for setting NPC conversation can be put in here
                        }
                        */
                    } else {
                        console.log(thor.currentTile.npcs[j].questItem.name + ": already in Thors inventory");
                        underText1 = (thor.currentTile.npcs[j].questItem.name + ": already in Thors inventory");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                    }

                    //No need to complete redundent cycles of for loop
                    break;
                }
            }
        } else if (thor.nextToType == "Obstacle") {
            //Work out which obstacle
            //The Obstacle array contains wall obstacles as well as game obstacles
            //Need to filter out the wall obstacles
            var replacementObstacleArray = [];
            for (var a = 0; a < thor.currentTile.obstacles.length; a++) {
                if (thor.currentTile.obstacles[a].id != "wall") {
                    replacementObstacleArray.push(thor.currentTile.obstacles[a]);
                }
            }
            for (var m = 0; m < replacementObstacleArray.length; m++) {

                //find the npc within the currentTile.items array
                if (replacementObstacleArray[m].id == thor.nextToID) {
                    //does the obstacle have a questItem
                    if (replacementObstacleArray[m].questItem === undefined) {
                        console.log("I'm a mere obstacle, move along!");
                    } else if (thor.items.indexOf(replacementObstacleArray[m].questItem) == -1) {
                        //if Thor doesn't already have item, add the whole object
                        thor.items.push(replacementObstacleArray[m].questItem);
                        console.log(replacementObstacleArray[m].questItem.name + ": added to Thors inventory");
                        underText1 = (replacementObstacleArray[m].questItem.name + ": added to Thors inventory");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                    } else {
                        console.log(replacementObstacleArray[m].questItem.name + ": already in Thors inventory");
                        underText1 = (replacementObstacleArray[m].questItem.name + ": already in Thors inventory");
                        underText2 = "";
                        underText3 = "";
                        underText4 = "";
                        underText5 = "";
                        underText6 = "";
                    }

                    //No need to complete redundent cycles of for loop
                    break;
                }
            }
        } else if (thor.nextToType == "PuzzlePeice") {

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
                                //console.log("PUZZLE COMPLETED! - KICKING OFF SUPPLIED PUZZLE FUNCTION!");

                                //Wall alert flash to let player know puzzle complete
                                var backgroundAlert = thor.currentTile.colour;
                                thor.currentTile.colour = "#ffff";
                                window.setTimeout(function() {
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

                                //Is key being issued? Then unlock the door on the given tile
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
        //Not near anything? Then just list inventory.
        else {
            //As the thor items is  list of objects, need to iterate through and add names to a new array to be output

            var thorInventoryOutput = [];
            for (var k = 0; k < thor.items.length; k++) {
                thorInventoryOutput.push(thor.items[k].name);
            }
            console.log("Thor's Swag Bag: " + thorInventoryOutput);

        }
    }
    itemObtainingOK = false;
}