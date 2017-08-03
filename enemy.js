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

function Enemy (id, startXPos, startYPos, width, height, colour, speed, move, health) {
    this.type = "enemy";
    this.id = id;
    this.startXPos = startXPos;
    this.startYPos = startYPos;
    this.xPos = startXPos;
    this.yPos = startYPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height);
        ctx.fill();
    };
    this.speed = speed;
    this.move = move;
    this.health = health;
    this.startHealth = health;
    this.alive = true;
}
// change to pass the correct pic in to the enemy constructor rather than having a number of different constructors
function randEnemy (id, startXPos, startYPos, width, height, colour, speed, move, health) {
    this.type = "enemy";
    this.id = id;
    this.startXPos = startXPos;
    this.startYPos = startYPos;
    this.xPos = startXPos;
    this.yPos = startYPos;
    this.width = 40;
    this.height = 40;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.drawImage(spiderPic, this.xPos,this.yPos, 40, 40);
        ctx.closePath();
    };
    this.speed = speed;
    this.move = move;
    this.health = health;
    this.startHealth = health;
    this.alive = true;
}
function moveTowardsThor() {
    var xDiff = thor.xPos - this.xPos;
    var yDiff = thor.yPos - this.yPos;
    var maxDiff  = Math.max(Math.abs(xDiff), Math.abs(yDiff));
    // ternary expressions below to ensure we still get sensible values when
    // the enemy is already on top of thor. In this case we obviously don't
    // want it to move, so set both speeds to zero
    var xSpeed = maxDiff ? this.speed*Math.abs(xDiff)/maxDiff : 0;
    var ySpeed = maxDiff ? this.speed*Math.abs(yDiff)/maxDiff : 0;
    this.xPos += Math.sign(xDiff)*xSpeed;
    this.yPos += Math.sign(yDiff)*ySpeed;
}

// the fixedPath funciton for enemy movement takes as an argument an array of points on the map
// (given in [xPos, yPos] form). It moves in a straight line towards the first point, then the second point,
// and so on until it reaches the last one, at which point it moves towards the first one.
// Note that, since we specify a startPos separately, this movement pattern can actually start outside
// its path before joining it
function fixedPath(points) {
    // because I'm (RZ) a bit of a geek for these things, I feel I should point out that the
    // following function is what's called a "closure". It allows the "points" parameter to be
    // retained for use by the movement function despite the fact that this outer fixedPath function
    // is only called once, when the enemy objects are initialised on page load
    return function() {
        if (this.targetIndex === undefined) {
            this.targetIndex = 0; //setting a new property on the enemy object. This will be OK provided
        // the function is always called from within the object (eg. enemy.move()).
        }

        var xDiff = points[this.targetIndex][0] - this.xPos;
        var yDiff = points[this.targetIndex][1] - this.yPos;
        if (Math.abs(xDiff)<this.speed && Math.abs(yDiff)<this.speed) {
            // if we're already at the target, move towards the next one. We need to go back to the
            // beginning if we're already at the end!
            // Note that we only check that the differences are less than the speed - otherwise
            // the enemy can get stuck in an oscillation about one point of the path,
            // because it keeps moving "either side" of the target and is never considered
            // close enough to move on to the next one
            this.targetIndex = (this.targetIndex == points.length-1 ? 0 : this.targetIndex+1);
            xDiff = points[this.targetIndex][0] - this.xPos;
            yDiff = points[this.targetIndex][1] - this.yPos;
        }
        var maxDiff  = Math.max(Math.abs(xDiff), Math.abs(yDiff));
        var xSpeed = maxDiff ? this.speed*Math.abs(xDiff)/maxDiff : 0;
        var ySpeed = maxDiff ? this.speed*Math.abs(yDiff)/maxDiff : 0;
        this.xPos += Math.sign(xDiff)*xSpeed;
        this.yPos += Math.sign(yDiff)*ySpeed;
    }
}

function randomMovement(stability) {
    // "stability" is a parameter which defines how many times the enemy needs to
    // keep moving in the same direction before changing
    return function() {
        if (this.timeInSameDir === undefined) {
            this.timeInSameDir = 0;
        }
        // array of "directions", in order, going clockwise from North
        var dirs = [[0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1]];
        // generate a random direction of initial movement, otherwise only go the
        // same way or "one direction apart":
        if (this.currentDirIndex === undefined) {
            this.currentDirIndex = Math.floor(dirs.length*Math.random());
        }
        else {
            if (this.timeInSameDir < stability) {
                var directionChange = 0;
            }
            else {
                var directionChange = Math.floor(3*Math.random())-1; // randomly choose -1, 0 or 1
                if (directionChange != 0) {
                    this.timeInSameDir = 0;
                }
            }
            if (directionChange == 0) {
                this.timeInSameDir++;
            }
            this.currentDirIndex = this.currentDirIndex + directionChange;
            if (this.currentDirIndex == -1) {
                this.currentDirIndex = dirs.length-1;
            }
            else if (this.currentDirIndex == dirs.length) {
                this.currentDirIndex = 0;
            }
        }

        var currentDir = dirs[this.currentDirIndex];
        // move by the given speed in that direction:
        this.xPos += currentDir[0]*this.speed;
        this.yPos += currentDir[1]*this.speed;
    }
}

var itsFollowingMe = new Enemy("follower", wallThickness, height-wallThickness-50, 10, 40, "hotpink", 2, moveTowardsThor, 20);
var xOscillator = new Enemy("x-oscillator", wallThickness, wallThickness, 50, 50, "magenta", 4, fixedPath([[wallThickness,
    wallThickness], [width-50, wallThickness]]), 8);
var triangulator = new Enemy("triangulator", 50, 80, 20, 20, "lightsteelblue", 2, fixedPath([[50,80], [280,400], [650,220]]), 12);
var funnyPath = new Enemy("funnyShape", wallThickness, wallThickness, 80, 80, "#21abd2", 5,
                            fixedPath([[wallThickness,wallThickness], [width-wallThickness-80,wallThickness],
                            [width-wallThickness-80,height*2/3], [width/2, wallThickness], [width/4, 400]]), 10);
var randomMover = new randEnemy("random", (width-100)/2, (height-20)/2, 20, 20, "white", 3, randomMovement(10), 5);