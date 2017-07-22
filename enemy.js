// note that the below global vars have to be moved here to get things to run!

//As this seems to be the place for globals...
//This holds what thor is next to, based on the last directional button push
//So if he is next to two things, one above and one to side, and up was last 
//button pressed, it'll hold the id of the 'thing' above
var thor_next_to = "nothing";


// canvas variables
var width = 1000;
var height = 700; 
var heightTwo = 200;
// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// new globalvar for wall thickness:
var wallThickness = 30;


// worldMap is an array which will contain all the individual mapTile objects
var worldMap = [];

/*
       Enemy constructor:
*/

function Enemy (id, xPos1, yPos1, xPos2, yPos2, colour, speed, move) {
    this.type = "Item";
    this.id = id;    
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos1,this.yPos1,this.xPos2,this.yPos2); 
        ctx.fill();
    };
    this.speed = speed;
    this.move = move;
}

function moveTowardsThor() {
    var xDiff = thor.xPos - this.xPos1;
    var yDiff = thor.yPos - this.yPos1;
    var maxDiff  = Math.max(Math.abs(xDiff), Math.abs(yDiff));
    // ternary expressions below to ensure we still get sensible values when
    // the enemy is already on top of thor. In this case we obviously don't
    // want it to move, so set both speeds to zero
    var xSpeed = maxDiff ? this.speed*Math.abs(xDiff)/maxDiff : 0;
    var ySpeed = maxDiff ? this.speed*Math.abs(yDiff)/maxDiff : 0;
    this.xPos1 += Math.sign(xDiff)*xSpeed;
    this.yPos1 += Math.sign(yDiff)*ySpeed;
}

// the fixedPath funciton for enemy movement takes as an argument an array of points on the map
// (given in [xPos, yPos] form). It moves in a straight line towards the first point, then the second point,
// and so on until it reaches the last one, at which point it moves towards the first one.
// Note that, since we specify a startPos separately, this movement pattern can actually start outside
// its path before joining it
function fixedPath(points) {
    return function() {
        if (this.targetIndex === undefined) {
            this.targetIndex = 0; //setting a new property on the enemy object. This will be OK provided
        // the function is always called from within the object (eg. enemy.move()).
        }

        var xDiff = points[this.targetIndex][0] - this.xPos1;
        var yDiff = points[this.targetIndex][1] - this.yPos1;
        if (Math.abs(xDiff)<this.speed && Math.abs(yDiff)<this.speed) {
            // if we're already at the target, move towards the next one. We need to go back to the
            // beginning if we're already at the end!
            // Note that we only check that the differences are less than the speed - otherwise
            // the enemy can get stuck in an oscillation about one point of the path,
            // because it keeps moving "either side" of the target and is never considered
            // close enough to move on to the next one
            this.targetIndex = (this.targetIndex == points.length-1 ? 0 : this.targetIndex+1);
            var xDiff = points[this.targetIndex][0] - this.xPos1;
            var yDiff = points[this.targetIndex][1] - this.yPos1;
        }
        var maxDiff  = Math.max(Math.abs(xDiff), Math.abs(yDiff));
        var xSpeed = maxDiff ? this.speed*Math.abs(xDiff)/maxDiff : 0;
        var ySpeed = maxDiff ? this.speed*Math.abs(yDiff)/maxDiff : 0;
        this.xPos1 += Math.sign(xDiff)*xSpeed;
        this.yPos1 += Math.sign(yDiff)*ySpeed;
    }
}

var itsFollowingMe = new Enemy("follower", 10, height-50, 30, 30, "hotpink", 2, moveTowardsThor);
var xOscillator = new Enemy("x-oscillator", 0, 0, 50, 50, "magenta", 1, fixedPath([[0,0], [width-50, 0]]));
var triangulator = new Enemy("triangulator", 50, 80, 20, 20, "lightsteelblue", 2, fixedPath([[50,80], [360,500], [650,330]]));
var funnyPath = new Enemy("funnyShape", wallThickness, wallThickness, 80, 80, "#21abd2", 5,
                            fixedPath([[wallThickness,wallThickness], [width-wallThickness-80,wallThickness],
                            [width-wallThickness-80,height*2/3], [width/2, 20], [width/4, 400]]));



