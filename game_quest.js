var lowerCanvas = document.getElementById("lowerCanvas");
var ctz = lowerCanvas.getContext("2d");

// event listeners
document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});
/* new event listener just for "o", because to go through doors it should respond to a single keydown,
not to a continous press (otherwise you xontinously flip between the 2 maps and it's pot luck where you end up)*/
var movingThroughDoor = false;
document.body.addEventListener("keydown", function(e) {
	if (e.keyCode == 79) {
		movingThroughDoor = true;
	}
});

// keyboard array (stores key value)
var keys = [];

// game elements
var hasRun = false; // used to set init values on first itteration of game loop

thor = {
	dispSize : 40,
	startXPos : ((width / 2) - (this.dispSize / 2)),
	startYPos : ((height / 2) - (this.dispSize / 2)),
	xPos : this.startXPos,
	yPos : this.startYPos,
	isPointing : 1,
	moveSize : 3,
	walkAnimFrame : 11,
	
	thorPicOneN : new Image(),
	thorPicTwoN : new Image(),

	thorPicOneE : new Image(),
	thorPicTwoE : new Image(),

	thorPicOneS : new Image(),
	thorPicTwoS : new Image(),

	thorPicOneW : new Image(),
	thorPicTwoW : new Image(),

	// need to know starting location
	currentTile: NWTile

}

thor.thorPicOneN.src = 'assets/thor/thor_one_n.png';
thor.thorPicTwoN.src = 'assets/thor/thor_two_n.png';

thor.thorPicOneE.src = 'assets/thor/thor_one_e.png';
thor.thorPicTwoE.src = 'assets/thor/thor_two_e.png';

thor.thorPicOneS.src = 'assets/thor/thor_one_s.png';
thor.thorPicTwoS.src = 'assets/thor/thor_two_s.png';

thor.thorPicOneW.src = 'assets/thor/thor_one_w.png';
thor.thorPicTwoW.src = 'assets/thor/thor_two_w.png';

// ----------------------    Land of Functs ---------------------------------------------
// clearCanvas() clears the canvas before each new frame. 
//i was going to put the code that draws the map features in here too 
//but not totally sure this would be best course of action 
function clearCanvas() {
	ctx.clearRect(0,0,width,height);
	ctz.clearRect(0,0,width,heightTwo);
}
/* function drawBackground() {
	ctx.fillStyle = "#02b109";
	ctx.fillRect(0,0,width,height);
	ctx.fill;
} */


// altered the above to draw the correct background for the current map tile
function drawBackground() {
	var tile = thor.currentTile;
	ctx.fillStyle = tile.colour;
	ctx.fillRect(0, 0, width, height);
	ctx.fill;
	// now draw the doors:
	for (var i=0; i<tile.doors.length; i++) {
		tile.doors[i].draw();
	}
	//now draw the obstacles
	for (var i=0; i<tile.obstacles.length; i++) {
		tile.obstacles[i].draw();
	}
	//now draw the items
	for (var i=0; i<tile.items.length; i++) {
		tile.items[i].draw();
	}
	//now draw the characters
	for (var i=0; i<tile.characters.length; i++) {
		tile.characters[i].draw();
	}


}

function drawunderparts(){
	ctz.fillStyle = "#8f7219";
	ctz.fillRect(0,0,width,heightTwo);
	ctz.fill;
}




// this is mostly still here because 
//i wanted to keep the example of how i was moving the main dude and regestering that keys had been pressed 
function thor_movement(){
	// up (w)
	if (keys[87]) {
		thor.isPointing = 1;

		thor.yPos -= thor.moveSize;
   		
		if( thor.yPos <= 0){
			thor.yPos = 0;
		}

		//Feeding in the current tiles Obstacles, Items, Characters array
		if (thorHitDetection(thor.currentTile.obstacles) 	||
			thorHitDetection(thor.currentTile.items)		||
			thorHitDetection(thor.currentTile.characters)){
			//if thor is hitting an object, set position to previous
			thor.yPos += thor.moveSize;
		}

		thor.walkAnimFrame += 1;
	}
	// down (s)
	if (keys[83]) {
		thor.isPointing = 3;
		thor.yPos += thor.moveSize;
		if( thor.yPos >= height - thor.dispSize){
			thor.yPos = height - thor.dispSize;
		}
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (thorHitDetection(thor.currentTile.obstacles) 	||
			thorHitDetection(thor.currentTile.items)		||
			thorHitDetection(thor.currentTile.characters)){
			//if thor is hitting an object, set position to previous
			thor.yPos -= thor.moveSize;
		}

		thor.walkAnimFrame += 1;
	}    
	// left (a)
	if (keys[65]) {
		thor.isPointing = 2;
		thor.xPos -= thor.moveSize;
		if( thor.xPos <= 0){
			thor.xPos = 0;
		}
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (thorHitDetection(thor.currentTile.obstacles) 	||
			thorHitDetection(thor.currentTile.items)		||
			thorHitDetection(thor.currentTile.characters)){
			//if thor is hitting an object, set position to previous
			thor.xPos += thor.moveSize;
		}
		thor.walkAnimFrame += 1;
	}
	// right (d)
	if (keys[68]) {
		thor.isPointing = 4;
		thor.xPos += thor.moveSize;
		if( thor.xPos >= width - thor.dispSize){
			thor.xPos = width - thor.dispSize;
		}
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (thorHitDetection(thor.currentTile.obstacles) 	||
			thorHitDetection(thor.currentTile.items)		||
			thorHitDetection(thor.currentTile.characters)){
			//if thor is hitting an object, set position to previous
			thor.xPos -= thor.moveSize;
		}		
		thor.walkAnimFrame += 1;
	}
}

/* put door detection code here, for better modularity (and making it much easier for me (RZ) to code it!)
This function takes the player's current x and y positions, and a door object, and checks whether the player
is "close enough" to be able to go through. Note that it checks on "both sides" of the door, even though the
door will usually be at the edge. This both avoids special cases, and enables there to possible be "doors"
which are not on the edge (eg. to go into a house)

Expect the behaviour to need plenty of tweaking later! */
function canIGoThroughDoor(x, y, door) {
	if (x<door.middleX+30 && x>door.middleX-30-thor.dispSize
	&& y<door.middleY+30 && y>door.middleY-30-thor.dispSize) {
		return true;
	}
	return false;
}

function thor_walkThroughDoor() {
	// check that o is pressed
	var tile = thor.currentTile;
	if (movingThroughDoor) {
		//  check that a door is within range
		for (var i=0; i<tile.doors.length; i++) {
			if (canIGoThroughDoor(thor.xPos, thor.yPos, tile.doors[i])) {
				console.log("I CAN go through this door!");
				// code to update thor.currentTile and set an appropriate x and y pos for the player
				for (var j=0; j<worldMap.length; j++) {
					if (worldMap[j].id == tile.doors[i].pointer[0]) {
						var newTile = worldMap[j];
						thor.currentTile = newTile;
						// find door where Thor will "arrive" at
						for (var k=0; k<newTile.doors.length; k++) {
							var door = newTile.doors[k];
							if (tile.doors[i].pointer[1] == door.doorId) {
								thor.xPos = Math.min(door.middleX, width-thor.dispSize);
								thor.yPos = Math.min(door.middleY, height-thor.dispSize);
								break;
							}
						}
						break;
					}
				}
				break;
			}
			else {
				console.log("what door? where?");
			}
		}
		movingThroughDoor = false;
	}
}

// function drawPlayer() { // draw player as a square
// 	ctx.fillStyle = "#000000";
// 	ctx.fillRect(thor.xPos, thor.yPos,thor.dispSize,thor.dispSize);
// 	ctx.fill();	
// }

function drawPlayer() {
	var thorPicOne
	var thorPicTwo
	if(thor.isPointing == 1){
		thorPicOne = thor.thorPicOneN; 
		thorPicTwo = thor.thorPicTwoN;
	}
	if(thor.isPointing == 4){// dirtections are labeled backwards somewhere
		thorPicOne = thor.thorPicOneE;
		thorPicTwo = thor.thorPicTwoE;
	}
	if(thor.isPointing == 3){
		thorPicOne = thor.thorPicOneS;
		thorPicTwo = thor.thorPicTwoS;
	}
	if(thor.isPointing == 2){// dirtections are labeled backwards somewhere
		thorPicOne = thor.thorPicOneW;
		thorPicTwo = thor.thorPicTwoW;
	}

	if (thor.walkAnimFrame < 10) {
		ctx.beginPath();
		ctx.drawImage(thorPicOne, thor.xPos, thor.yPos, thor.dispSize, thor.dispSize);
		ctx.closePath();
	}
	else if (thor.walkAnimFrame > 9) {
		ctx.beginPath();
		ctx.drawImage(thorPicTwo, thor.xPos, thor.yPos, thor.dispSize, thor.dispSize);
		ctx.closePath();
		
		if(thor.walkAnimFrame > 19){
			thor.walkAnimFrame = 0;
		}
	}// draw player from a .png (40px,40px)
}

function words(){
	ctz.font = "30px Arial";
	ctz.fillStyle = "#000";
	// ctz.fillText("This is where there will be words and maybe pictures",10,50);
	ctz.fillText("this is the map tile called " + thor.currentTile.id, 10, 50);
	ctz.fill;
}

function quit() {
	hasRun = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
}

function stopMusic(){
	gameMusic.pause();
}

//------------------ gameloop ---------------------------------------------------------
function gameLoop(){
	
	if (hasRun === false) {
		// initalise all game variables here
		clearCanvas();	
		thor.xPos = ((width/2) - (thor.dispSize/2));
		thor.yPos = ((height/2) - (thor.dispSize/2));
		// gameMusics.play();	
		drawBackground();
		drawPlayer();
		hasRun = true;	
	}
	
	// if (lives === 0) {
	// 	quit();
	// }

	clearCanvas();
 	thor_movement();
	thor_walkThroughDoor();
 	drawBackground();
 	drawPlayer();
 	drawunderparts();
 	words();

 	requestAnimationFrame(gameLoop);

	// 'q' for quit
	if (keys[81]) {  	
		quit();
	}
}