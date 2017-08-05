
var lowerCanvas = document.getElementById("lowerCanvas");
var ctz = lowerCanvas.getContext("2d");

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

var thor = {
    health: 100,
    dispSize : 40,
// defining width and height separately, because needed for hit detection code now:
    height: 40,
    width: 40,
    startXPos : width/2 - 20,
    startYPos : height/2 - 20,
    xPos : width/2 - 20,
    yPos : height/2 - 20,
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
    currentTile: NWTile,

    // set properties to force lightning to not be able to be fired continuously (the value below means approx.
    // 4 bolts per second can be fired) - and enable it to be fired right at the start if needed
    lightningFrameLimit: 15,
    lightningFrameCount: 15,
    maxLightningCount: 3, // maximum no. of lightning bolts allowed on screen at once
    swordFrameLimit: 15,
    swordFrameCount: 15
};

var lightning = {
    size: 20,
    speed: 5,
    positions: []
// positions will be an array of objects - one for each "block" of lightning on the screen
// each such block will have 3 properties, an xPos, yPos and a direction
};

thor.thorPicOneN.src = 'assets/thor/thor_one_n.png';
thor.thorPicTwoN.src = 'assets/thor/thor_two_n.png';

thor.thorPicOneE.src = 'assets/thor/thor_one_e.png';
thor.thorPicTwoE.src = 'assets/thor/thor_two_e.png';

thor.thorPicOneS.src = 'assets/thor/thor_one_s.png';
thor.thorPicTwoS.src = 'assets/thor/thor_two_s.png';

thor.thorPicOneW.src = 'assets/thor/thor_one_w.png';
thor.thorPicTwoW.src = 'assets/thor/thor_two_w.png';

// grahics for items
var keyPic = new Image();
keyPic.src = 'assets/items/key_sm.png';



// ----------------------    Land of Functs ---------------------------------------------
// clearCanvas() clears the canvas before each new frame.
//i was going to put the code that draws the map features in here too
//but not totally sure this would be best course of action
function clearCanvas() {
    ctx.clearRect(0,0,width,height);
    ctz.clearRect(0,0,width,heightTwo);
}



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

//draw lightning
    for (var i=0; i<lightning.positions.length; i++) {
        ctx.beginPath();
        ctx.fillStyle="white";
        ctx.rect(lightning.positions[i].xPos, lightning.positions[i].yPos, lightning.size, lightning.size);
        ctx.fill();
    };

}

function drawunderparts(){
    ctz.fillStyle = "#8f7219";
    ctz.fillRect(0,0,width,heightTwo);
    ctz.fill;
    ctz.fillStyle = "#000";
    ctz.moveTo((width/2),0);
    ctz.lineTo((width/2),heightTwo);
    ctz.stroke();
    //tells you your health

    ctz.fillStyle = "#000";
    if (thor.health <= 0) {
        ctz.font = "100px Arial";
        ctz.fillText("Sorry, you're DEAD!!!", 10, 100);
        ctz.fill;
        quit();
    }
    else {

        ctz.fillStyle = "#f00"
        ctz.fillRect(((width/2)+10), 10, ((((width/2)-20)/100)*thor.health), 10);
        ctz.fill;

    }
}
// "new" functions to simplify hit-detection code:
function itCantGoThere(mover) {
    return (hitDetection(mover, thor.currentTile.obstacles) ||
            hitDetection(mover, thor.currentTile.items) ||
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

/* this function is now completely reworked, and only checks if thor is pointing in the right direction to
go through the door. Hit detection is now done in the thor_walkThroughDoor funciton itself (by calling the
hitDetection function, of course). Note that it still needs parameters x, y and size, because of the awkward
"centre doors", where Thor's direction is irrelevant, and only his position counts*/
function canIGoThroughDoor(x, y, size, door) {
    if (hitDetection(thor, [door], door instanceof CentreDoor ? 0 : 1-wallThickness) && 
        /* negative tolerance, to make sure you can only go through when you are right at the edge
        of the screen. Doesn't work well if applied to Centre Doors though! */
        ((thor.currentTile.northDoors.indexOf(door) > -1 && thor.isPointing == 1)
        || (thor.currentTile.westDoors.indexOf(door) > -1 && thor.isPointing == 2)
        || (thor.currentTile.southDoors.indexOf(door) > -1 && thor.isPointing == 3)
        || (thor.currentTile.eastDoors.indexOf(door) > -1 && thor.isPointing == 4)
        || (thor.currentTile.centreDoors.indexOf(door) > -1 && hitDetection(thor, [door])))) {
        return true;
    }
    return false;
}

function thor_walkThroughDoor() {
    var tile = thor.currentTile;
    //  check that Thor is able to go through (mostly a check that he is pointing in the right direction)
    for (var i=0; i<tile.doors.length; i++) {
        if (canIGoThroughDoor(thor.xPos, thor.yPos, thor.dispSize, tile.doors[i])) {
            // put in to test doors were being correctly recognised while debugging. I will leave it in for now.
            console.log ("going through door with ID " + tile.doors[i].doorID);
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
                        // finally remove all lightning from new screen!
                        lightning.positions = [];
                    }
                    // find door where Thor will "arrive" at
                    for (var k=0; k<newTile.doors.length; k++) {
                        var door = newTile.doors[k];
                        if (tile.doors[i].pointer[1] == door.doorID) {
                            thor.xPos = door.xPos + (door.width - thor.dispSize)/2;
                            thor.yPos = door.yPos + (door.height - thor.dispSize)/2;
                            break;
                        }
                    }
                    break;
                }
            }
            break;
        }
    }
}

//function drawPlayer() { // draw player as a square
//ctx.fillStyle = "#000000";
//ctx.fillRect(thor.xPos, thor.yPos,thor.dispSize,thor.dispSize);
//ctx.fill();
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


/* there are 2 possible ways of implementing the limit on lightning bolts:
1) not allow a new one to be fired until enough old ones have disappeared naturally by hitting something
2) always allow one to be fired, but remove the oldest bolt at the same time
I think I prefer 2), so this is what is below. To remove 2) and enable 1), simply remove the comment markers in the
3rd "if" statemenet below, and comment out the 3-line "if" block around the lightning.positions.shift() statement */
function violence() {
    if (keys[86]) { // V for violence, why not?
        if (thor.health == 100) {
            if (thor.lightningFrameCount >= thor.lightningFrameLimit 
                /*&& lightning.positions.length < thor.maxLightningCount*/) { 
                // fire lightning! But only if enough frames have elapsed and there aren't already too many on screen
                var directions = [[0,-1], [-1,0], [0,1], [1,0]];
                var lightningStartXPos, lightningStartYPos;
                if (thor.isPointing == 1) { // up
                    lightningStartXPos = thor.xPos + (thor.dispSize - lightning.size)/2;
                    lightningStartYPos = thor.yPos - lightning.size;
                }
                else if (thor.isPointing == 2) { // left
                    lightningStartXPos = thor.xPos - lightning.size;
                    lightningStartYPos = thor.yPos + (thor.dispSize - lightning.size)/2;
                }
                else if (thor.isPointing == 3) { // down
                    lightningStartXPos = thor.xPos + (thor.dispSize - lightning.size)/2;
                    lightningStartYPos = thor.yPos + thor.dispSize;
                }
                else if (thor.isPointing == 4) { // right
                    lightningStartXPos = thor.xPos + thor.dispSize;
                    lightningStartYPos = thor.yPos + (thor.dispSize - lightning.size)/2;
                }
                lightning.positions.push({
                    xPos: lightningStartXPos,
                    yPos: lightningStartYPos,
                    width: lightning.size,
                    height: lightning.size,
                    direction: directions[thor.isPointing - 1]
                });
                // remove oldest lightning bolt from screen if there are now too many
                if (lightning.positions.length > thor.maxLightningCount) {
                    lightning.positions.shift();
                }
                thor.lightningFrameCount = 0; // reset count
            }
        }
        else {
            // hit with sword
            if (thor.swordFrameCount >= thor.swordFrameLimit) {
                console.log("feel my sword, you annoying bunch of pixels!")
                for (var i=0; i<thor.currentTile.enemies.filter(enemy => enemy.alive).length; i++) {
                    var enemy = thor.currentTile.enemies.filter(enemy => enemy.alive)[i];
                    // hit detection for sword - needs Thor pointing in the same direction as the enemy!
                    if (hitDetection(thor, [enemy], 20, thor.isPointing)) {
                        enemy.health--;
                        enemy.hasBeenHit = true;
                        console.log (enemy.id + " health now " + enemy.health);
                        if (enemy.health <= 0) {
                            enemy.alive = false;
                        }
                    }
                }
                thor.swordFrameCount = 0;
            }
        }
    }
}

function lightningMoveAndHits() {
    /* start to construct new array of lightning position objects. We want to remove any
    which have hit an enemy - but if we just remove from the array we are looping over
    that strange behaviour could result. To be save we start with a new empty array,
    add each lightning block back in if it *hasn't* hit an enemy, then set lightning.positions
    to be the new array at the end of the loop */
    for (var i=0; i<thor.currentTile.enemies.filter(enemy => enemy.alive).length; i++) {
        var enemy = thor.currentTile.enemies.filter(enemy => enemy.alive)[i];
        if (hitDetection(enemy, lightning.positions)) {
            enemy.health--;
            enemy.hasBeenHit = true;
            console.log (enemy.id + " hit by lightning! Health now " + enemy.health);
            if (enemy.health <= 0) {
                enemy.alive = false;
            }
        }
    }

    var newLightningPositions = [];
    for (var i=0; i<lightning.positions.length; i++) {
        var keepIt = true;

        // remove lightning if it hits an enemy (or obstacle/npc/item/thor)!
        if (itCantGoThere(lightning.positions[i])) {
            keepIt = false;
        }
        if (keepIt) {
            newLightningPositions.push(lightning.positions[i]);
        }
        // lightning movement
        lightning.positions[i].xPos += lightning.speed*lightning.positions[i].direction[0];
        lightning.positions[i].yPos += lightning.speed*lightning.positions[i].direction[1];
    }
    lightning.positions = newLightningPositions;
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

    clearCanvas();
    thor_movement();
    thor_walkThroughDoor();
    violence();
    lightningMoveAndHits();
    enemyMovement();
    drawBackground();
    drawPlayer();
    drawunderparts();
    thor_healthCheck();
    // words();
    obtainItem();
    //To enable diaglogue with NPC's on key press (C)
    npcButtonChat();
    thor.lightningFrameCount++;
    thor.swordFrameCount++;

    requestAnimationFrame(gameLoop);

    // 'q' for quit
    if (keys[81]) {
        quit();
    }
}