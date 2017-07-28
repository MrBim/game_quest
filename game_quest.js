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
	health: 100,
	dispSize : 40,
	// defining width and height separately, because needed for hit detection code now:
	height: 40,
	width: 40,
	startXPos : ((width / 2) - (this.dispSize / 2)),
	startYPos : ((height / 2) - (this.dispSize / 2)),
	xPos : this.startXPos,
	yPos : this.startYPos,
	isPointing : 1,
	moveSize : 3,
	walkAnimFrame : 11,
	items: [],
	nextToID: "nothing",
	nextToType: "nothing",		

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
	/* for (var i=0; i<tile.doors.length; i++) {
		tile.doors[i].draw();
	} */
	// draw any "centre doors" - those which are not just gaps in walls:
	for (var i=0; i<tile.centreDoors.length; i++) {
		tile.centreDoors[i].draw();
	}
	//now draw the obstacles
	for (var i=0; i<tile.obstacles.length; i++) {
		tile.obstacles[i].draw();
	}
	//now draw the items
	for (var i=0; i<tile.items.length; i++) {
		tile.items[i].draw();
	}
	//now draw the npcs
	for (var i=0; i<tile.npcs.length; i++) {
		tile.npcs[i].draw();
	}
	//now draw the enemies
	
	for (var i=0; i<tile.enemies.length; i++) {
		if (tile.enemies[i].alive) {
			tile.enemies[i].draw();
		}
	}
	
}

function drawunderparts(){
	ctz.fillStyle = "#8f7219";
	ctz.fillRect(0,0,width,heightTwo);
	ctz.fill;
}

// "new" functions to simplify hit-detection code:
function itCantGoThere(mover) {
	return (hitDetection(mover, thor.currentTile.obstacles) ||
			hitDetection(mover, thor.currentTile.items)	||
			hitDetection(mover, thor.currentTile.npcs) ||
			hitDetection(mover, thor.currentTile.enemies.filter(enemy => enemy.alive)) ||
			hitDetection(mover, [thor]));
}

function stayOnScreen(mover) {
	// a simple function, to make sure things that move stay on the canvas
	// will be applied to Thor and to all enemies
	if (mover.xPos <= 0) {
		mover.xPos = 0;
	}
	if (mover.xPos+mover.width >= width) {
		mover.xPos = width - mover.width;
	}
	if (mover.yPos <= 0) {
		mover.yPos = 0;
	}
	if (mover.yPos+mover.height >= height) {
		mover.yPos = height - mover.height;
	}
}


// this is mostly still here because 
//i wanted to keep the example of how i was moving the main dude and regestering that keys had been pressed 
function thor_movement(){
	// up (w)
	if (keys[87]) {
		thor.isPointing = 1;

		thor.yPos -= thor.moveSize;
   		
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (itCantGoThere(thor)) {
			//if thor is hitting an object, set position to previous
			thor.yPos += thor.moveSize;
		}

		thor.walkAnimFrame += 1;
	}
	// down (s)
	if (keys[83]) {
		thor.isPointing = 3;
		thor.yPos += thor.moveSize;
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (itCantGoThere(thor)) {
			//if thor is hitting an object, set position to previous
			thor.yPos -= thor.moveSize;
		}

		thor.walkAnimFrame += 1;
	}    
	// left (a)
	if (keys[65]) {
		thor.isPointing = 2;
		thor.xPos -= thor.moveSize;
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (itCantGoThere(thor)) {
			//if thor is hitting an object, set position to previous
			thor.xPos += thor.moveSize;
		}
		thor.walkAnimFrame += 1;
	}
	// right (d)
	if (keys[68]) {
		thor.isPointing = 4;
		thor.xPos += thor.moveSize;
		//Feeding in the current tiles Obstacles, Items, Characters array
		if (itCantGoThere(thor)) {
			//if thor is hitting an object, set position to previous
			thor.xPos -= thor.moveSize;
		}		
		thor.walkAnimFrame += 1;
	}

	stayOnScreen(thor);
}

/* put door detection code here, for better modularity (and making it much easier for me (RZ) to code it!)
This function takes the player's current x and y positions, and a door object, and checks whether the player
is "close enough" to be able to go through. Note that it checks on "both sides" of the door, even though the
door will usually be at the edge. This both avoids special cases, and enables there to possible be "doors"
which are not on the edge (eg. to go into a house)

Expect the behaviour to need plenty of tweaking later! */
function canIGoThroughDoor(x, y, size, door) {
	if (x<door.right-size+30 && x>door.left-30 && y<door.bottom-size+30 && y>door.top-30) {
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
			if (canIGoThroughDoor(thor.xPos, thor.yPos, thor.dispSize, tile.doors[i])) {
				console.log("I CAN go through this door!");
				// code to update thor.currentTile and set an appropriate x and y pos for the player
				for (var j=0; j<worldMap.length; j++) {
					if (worldMap[j].id == tile.doors[i].pointer[0]) {
						var newTile = worldMap[j];
						thor.currentTile = newTile;
						// set all enemies to be in their initial positions on new tile
						// - also regenerate them if they were previously dead!:
						for (var k=0; k<newTile.enemies.length; k++) {
							var enemy = newTile.enemies[k];
							enemy.alive = true;
							enemy.health = enemy.startHealth;
							enemy.xPos = enemy.startXPos;
							enemy.yPos = enemy.startYPos;
							// also make sure fixed-path enemies resume their path from the start:
							enemy.targetIndex = undefined;
						}
						// find door where Thor will "arrive" at
						for (var k=0; k<newTile.doors.length; k++) {
							var door = newTile.doors[k];
							if (tile.doors[i].pointer[1] == door.doorID) {
								thor.xPos = (door.left + door.right - thor.dispSize)/2;
								thor.yPos = (door.top + door.bottom - thor.dispSize)/2;
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
	ctz.fillStyle = "#000";
	// ctz.fillText("This is where there will be words and maybe pictures",10,50);
	//ctz.fillText("this is the map tile called " + thor.currentTile.id, 10, 50);
	if (thor.health <= 0) {
		ctz.font = "100px Arial";
		ctz.fillText("Sorry, you're DEAD!!!", 10, 100);
		ctz.fill;
		quit();
	}
	else {
		ctz.font = "30px Arial";
		ctz.fillText("Current health: " + thor.health, 10, 50);
		ctz.fill;
	}
}

function enemyMovement() {
	for (var i=0; i<thor.currentTile.enemies.length; i++) {
		var enemy = thor.currentTile.enemies[i];
		var currentXPos = enemy.xPos;
		var currentYPos = enemy.yPos;
		enemy.move();
		if (itCantGoThere(enemy)) {
			enemy.xPos = currentXPos;
			enemy.yPos = currentYPos;
			// hacky way to try to allow randomly-moving enemies to instantly "try again"
			// when they've hit an obstacle.
			if (enemy.timeInSameDir) {
				enemy.timeInSameDir = Infinity;
				// make sure it is greater than the stability variable, whatever that happens to be
				// (I said it was hacky ;) 
			}
		}
		stayOnScreen(enemy);
	}
}

function violence() {
	if (keys[86]) { // V for violence, why not?
		if (thor.health == 100) {
			// fire lightning, code will go here!
		}
		else {
			// hit with sword
			console.log("feel my sword, you annoying bunch of pixels!")
			for (var i=0; i<thor.currentTile.enemies.filter(enemy => enemy.alive).length; i++) {
				// trying out arrow functions for the first time, why not? Saves quite a lot of space here!
				var enemy = thor.currentTile.enemies.filter(enemy => enemy.alive)[i];
				if (hitDetection(thor, [enemy], 10)) {
					enemy.health--;
					console.log (enemy.id + " health now " + enemy.health);
					if (enemy.health <= 0) {
						enemy.alive = false;
					}
				}
			}
		}
	}
}

function thor_healthCheck() {
	if (thor.hasBeenHit) {
		thor.health--;
		thor.hasBeenHit = false;
	}
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
	violence();
	enemyMovement();
 	drawBackground();
 	drawPlayer();
	drawunderparts();
	thor_healthCheck();
 	words();
	obtainItem();
 	//To enable diaglogue with NPC's on key press (C)
	npcButtonChat();



 	requestAnimationFrame(gameLoop);

	// 'q' for quit
	if (keys[81]) {  	
		quit();
	}
}