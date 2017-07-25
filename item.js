/*
       Item constructor:
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



/* Can get an item in one of two ways, pick up or given (next to NPC), also need to list items (button press when not near item or NPC) */

var itemObtainingOK;

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
					console.log(thor.currentTile.npcs[i].questItem.name + ": added to Thors inventory");
					//remove it from the current tile
					thor.currentTile.items.splice(thor.currentTile.items[i], 1);
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
						console.log("Sorry, nothing to give you, onwards on your quest!");
					}
	
					else if (thor.items.indexOf(thor.currentTile.npcs[j].questItem) == -1){
						//if Thor doesn't already have item, add the whole object
						thor.items.push(thor.currentTile.npcs[j].questItem);
						console.log(thor.currentTile.npcs[j].questItem.name + ": added to Thors inventory");
					}
					else{
						console.log(thor.currentTile.npcs[j].questItem.name + ": already in Thors inventory");
					}
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

