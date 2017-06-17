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




// draw canvas clears the canvas before each new frame. 
//i was going to put the code that draws the map features in here too 
//but not totally sure this would be best course of action 
function drawCanvas() {
	ctx.clearRect(0,0,width,height);
}
// this is mostly still here because 
//i wanted to keep the example of how i was moving the main dude and regestering that keys had been pressed 
function thor_movement(){
	// up (w)
	if (keys[87]) {
		isPointing = 1;
		yPos -= moveSize;
		if( yPos <= 0){
			yPos = 0;
		}
		walkAnimFrame += 1;
	}
	// down (s)
	if (keys[83]) {
		isPointing = 3;
		yPos += moveSize;
		if( yPos >= height - dispSize){
			yPos = height - dispSize;
		}
		walkAnimFrame += 1;
	}    
	// left (a)
	if (keys[65]) {
		isPointing = 2;
		xPos -= moveSize;
		if( xPos <= 0){
			xPos = 0;
		}
		walkAnimFrame += 1;
	}
	// right (d)
	if (keys[68]) {
		isPointing = 4;
		xPos += moveSize;
		if( xPos >= width - dispSize){
			xPos = width - dispSize;
		}
		walkAnimFrame += 1;
	}
}

function drawPlayer() { // draw player as a square
	ctx.fillStyle = "#000000";
	ctx.fillRect(xPos, yPos,dispSize,dispSize);
	ctx.fill();	
}

function quit() {
	hasRun = false;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	xPos = ((width/2) - (dispSize/2));
	yPos = ((height/2) - (dispSize/2));
}

function stopMusic(){
	gameMusic.pause();
}

//------------------ gameloop ---------------------------------------------------------
function gameLoop(){
	
	if (hasRun === false) {
		// initalise all game variables here
		drawCanvas();	
		gameMusics.play();	
		hasRun = true;	
	}
	
	if (lives === 0) {
		quit();
	}

	drawCanvas();
 	thor_movement();
 	drawPlayer();

 	requestAnimationFrame(gameLoop);

	// 'q' for quit
	if (keys[81]) {  	
		quit();
	}
}