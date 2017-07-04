// canvas variables
var width = 1000;
var height = 700; 
// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// event listeners
document.body.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
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
	moveSize : 3
}


// ----------------------    Land of Functs ---------------------------------------------
// clearCanvas() clears the canvas before each new frame. 
//i was going to put the code that draws the map features in here too 
//but not totally sure this would be best course of action 
function clearCanvas() {
	ctx.clearRect(0,0,width,height);
}
function drawBackground() {
	ctx.fillStyle = "#e2b109";
	ctx.fillRect(0,0,width,height);
	ctx.fill;
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
		thor.walkAnimFrame += 1;
	}
	// down (s)
	if (keys[83]) {
		thor.isPointing = 3;
		thor.yPos += thor.moveSize;
		if( thor.yPos >= height - thor.dispSize){
			thor.yPos = height - thor.dispSize;
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
		thor.walkAnimFrame += 1;
	}
	// right (d)
	if (keys[68]) {
		thor.isPointing = 4;
		thor.xPos += thor.moveSize;
		if( thor.xPos >= width - thor.dispSize){
			thor.xPos = width - thor.dispSize;
		}
		thor.walkAnimFrame += 1;
	}
}

function drawPlayer() { // draw player as a square
	ctx.fillStyle = "#000000";
	ctx.fillRect(thor.xPos, thor.yPos,thor.dispSize,thor.dispSize);
	ctx.fill();	
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
 	drawBackground();
 	drawPlayer();

 	requestAnimationFrame(gameLoop);

	// 'q' for quit
	if (keys[81]) {  	
		quit();
	}
}