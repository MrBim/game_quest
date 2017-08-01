
//Variable to limit key press to one function execution per key press
//Can have multiple executions for one button press otherwise (keyboard quirk)
var itemObtainingOK;

/*
    Item constructor

	Noteworthy elements:
			  id: The ID is deemed the unique identifier for the item on any tile.
			name: items in game name (eg "Magic Key"), you can have more than 1 item of the same name on the current tile.
*/


function Item (id, name, xPos, yPos, width, height, colour) {
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
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height);
        ctx.fill();
        };
}

document.body.addEventListener("keydown", function(e) {
    //Using the I 'item' key
	if (e.keyCode == 73) {
		itemObtainingOK = true;
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

function obtainItem(){
    if (itemObtainingOK) {

    	//Is Thor next to an item?
		if (thor.nextToType == "Item"){
  			//work out which item
        	for (var i=0; i<thor.currentTile.items.length; i++) {
        		//find the npc within the currentTile.items array
				if (thor.currentTile.items[i].id == thor.nextToID){
					//add it to Thors inventory
 					thor.items.push(thor.currentTile.items[i]);
					console.log(thor.currentTile.items[i].name + ": added to Thors inventory");
					//remove it from the current tile
					thor.currentTile.items.splice(thor.currentTile.items[i], 1);

					//enable inventory to be shown directly after pick up, without need to move
            		thor.nextToID = "nothing";
            		thor.nextToType = "nothing";

					//No need to complete redundent cycles of for loop
					break;
				}
			}
    	}
    	//Is Thor next to an NPC?
		else if (thor.nextToType == "NPC"){
			//work out which NPC
        	for (var j=0; j<thor.currentTile.npcs.length; j++) {
        		//find the npc within the currentTile.items array
				if (thor.currentTile.npcs[j].id == thor.nextToID){
					//does the NPC have a questItem

					if (thor.currentTile.npcs[j].questItem === undefined){
						console.log(thor.currentTile.npcs[j].id.toUpperCase() + ": Sorry, nothing to give you, onwards with your quest!");
					}

					else if (thor.items.indexOf(thor.currentTile.npcs[j].questItem) == -1){
						//if Thor doesn't already have item, add the whole object
						thor.items.push(thor.currentTile.npcs[j].questItem);
						console.log(thor.currentTile.npcs[j].questItem.name + ": added to Thors inventory");
					}
					else{
						console.log(thor.currentTile.npcs[j].questItem.name + ": already in Thors inventory");
					}
	
					//No need to complete redundent cycles of for loop
					break;
				}
			}
		}
		//Not near anything? Then just list inventory.
		else {
			//As the thor items is  list of objects, need to iterate through and add names to a new array to be output
			var thorInventoryOutput = [];
        	for (var k=0; k<thor.items.length; k++) {
        		thorInventoryOutput.push(thor.items[k].name);
        	}
        	console.log(thorInventoryOutput);
    	}
    }
    itemObtainingOK = false;
}