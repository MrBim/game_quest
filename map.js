// map definition code (first attempt!)


// going to create a simple square map for now, but hopefully easily extensible,
// without tying us into using a grid system for everything

//  constructor for map tile objecst. Each is passed an array of doors, items and characters (in the form of objects)
// it also has an ID name (or perhaps number) which identifies it for the purposes of other code which needs
// to interact with it (eg doors leading to that room).
// I am also adding a colour property, mainly to allow easy identification of rooms at this early stage. I imagine
// that in the final code it will be replaced by an image, or something
function MapTile (id, doors, items, npcs, obstacles, enemies, colour, wallColour) {
    this.id = id;
    this.doors = doors;
    this.northDoors = this.doors.filter(function(door) {return door instanceof NWallDoor;});
    this.eastDoors = this.doors.filter(function(door) {return door instanceof EWallDoor;});
    this.southDoors = this.doors.filter(function(door) {return door instanceof SWallDoor;});
    this.westDoors = this.doors.filter(function(door) {return door instanceof WWallDoor;});
    this.centreDoors = this.doors.filter(function(door) {return door instanceof CentreDoor;});
    this.items = items;
    this.obstacles = obstacles;
    this.enemies = enemies;
    this.wallSegments = this.getWallSegments();
    this.wallColour = wallColour;
    // add wall segments to obstacles array:
    for (var i=0; i<this.wallSegments.length; i++) {
        var indices = this.wallSegments[i];
        this.obstacles.push(new Obstacle("wall", indices[0], indices[1], indices[2], indices[3], this.wallColour));
    }
    this.npcs = npcs;
    this.colour = colour;
    worldMap.push(this);
}

/* door constructor function. Each door has an x and y position (both a "start" and an "end", since I am imagining
the doors as lines for now), a colour in which to draw that line, a doorID (which only needs to be unique within
each tile), and a "pointer" to another door (identified by mapTile and ID) to which it leads when the player walks
through it. I imagine at this stage that pointer will be a 2-element array containing a mapTile id and a door ID
It also has a "draw" method to display it on the screen.
Only the doorID and pointer properties are really part of the logic here - the rest is a convenience for me to test
these things out and should be easily able to be changed in accordance with what we want the roos/doors to look like*/
function Door (doorID, colour, pointer) {
    this.doorID = doorID;
    // this.xPos1 = xPos1;
    // this.yPos1 = yPos1;
    // this.xPos2 = xPos2;
    // this.yPos2 = yPos2;
    // this.middleX = (xPos1 + xPos2)/2;
    // this.middleY = (yPos1 + yPos2)/2;
    this.colour = colour;
    this.pointer = pointer;
}

/* define different types of doors, each inheriting from the base Door class. We will have a separate subclass for
doors on each of the 4 walls, plus one more for doors which do not lie on a wall */

function NWallDoor(startPos, width) {
    this.startPos = startPos;
    this.width = width;
    // this.middleX = startPos + width/2;
    // this.middleY = 0;
    this.left = this.startPos;
    this.right = this.startPos + this.width;
    this.top = 0;
    this.bottom = wallThickness;
    this.xPos = this.startPos;
    this.yPos = 0;
    this.height = wallThickness;
}

NWallDoor.prototype = Object.create(Door.prototype);
NWallDoor.prototype.constructor = NWallDoor;


function EWallDoor(startPos, height) {
    this.startPos = startPos;
    this.height = height;
    // this.middleX = width;
    // this.middleY = startPos + height/2;
    this.left = width - wallThickness;
    this.right = width;
    this.top = this.startPos;
    this.bottom = this.startPos + this.height;
    this.xPos = width - wallThickness;
    this.yPos = this.startPos;
    this.width = wallThickness;
}

EWallDoor.prototype = Object.create(Door.prototype);
EWallDoor.prototype.constructor = EWallDoor;


function SWallDoor(startPos, width) {
    this.startPos = startPos;
    this.width = width;
    // this.middleX = startPos + width/2;
    // this.middleY = height;
    this.left = this.startPos;
    this.right = this.startPos + this.width;
    this.top = height - wallThickness;
    this.bottom = height;
    this.xPos = this.startPos;
    this.yPos = height - wallThickness;
    this.height = wallThickness;
}

SWallDoor.prototype = Object.create(Door.prototype);
SWallDoor.prototype.constructor = SWallDoor;


function WWallDoor(startPos, height) {
    this.startPos = startPos;
    this.height = height;
    // this.middleX = 0;
    // this.middleY = startPos + height/2;
    this.left = 0;
    this.right = wallThickness;
    this.top = this.startPos;
    this.bottom = this.startPos + this.height;
    this.xPos = 0;
    this.yPos = this.startPos;
    this.width = wallThickness;
}

WWallDoor.prototype = Object.create(Door.prototype);
WWallDoor.prototype.constructor = WWallDoor;


function CentreDoor(xPos1, yPos1, xPos2, yPos2, colour) {
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    // this.middleX = (xPos1 + xPos2)/2;
    // this.middleY = (yPos1 + yPos2)/2;
    this.colour = colour;
    this.left = Math.min(this.xPos1, this.xPos2);
    this.right = Math.max(this.xPos1, this.xPos2);
    this.top = Math.min(this.yPos1, this.yPos2);
    this.bottom = Math.max(this.yPos1, this.yPos2);
    this.xPos = Math.min(this.xPos1, this.xPos2);
    this.yPos = Math.min(this.yPos1, this.yPos2);
    this.width = Math.max(this.xPos1, this.xPos2) - this.xPos;
    this.height = Math.max(this.yPos1, this.yPos2) - this.yPos;
}

CentreDoor.prototype = Object.create(Door.prototype);
CentreDoor.prototype.constructor = CentreDoor;

CentreDoor.prototype.draw = function() {
    ctx.beginPath();
    ctx.moveTo(this.xPos1, this.yPos1);
    ctx.lineTo(this.xPos2, this.yPos2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = this.colour;
    ctx.stroke();
}

// Add "drawWalls()" method to mapTile object, which takes note of positions of any
// doors in the walls, and leaves the appropriate gaps. Will implement with basic rectangles atm.

// first an important "helper" method to do the work of finding all the wall segments which should be drawn.
// it does nothing with that information itself!
MapTile.prototype.getWallSegments = function() {
    var result = [];

    // North wall:
    var NWallGaps = [];
    for (var i=0; i<this.northDoors.length; i++) {
        var door = this.northDoors[i];
        NWallGaps.push([door.startPos, door.width]);
    }
    /* sort the array by startPos, so that the following will work
    no matter what order the array of doors is in */
    NWallGaps.sort(function(gap) {return gap.startPos;});
    var NWallProgress = 0;
    for (var i=0; i<NWallGaps.length; i++) {
        result.push([NWallProgress, 0, NWallGaps[i][0]-NWallProgress, wallThickness]);
        NWallProgress += NWallGaps[i][0]+NWallGaps[i][1];
    }
    result.push([NWallProgress, 0, width-NWallProgress, wallThickness]);

    // East Wall:
    var EWallGaps = [];
    for (var i=0; i<this.eastDoors.length; i++) {
        var door = this.eastDoors[i];
        EWallGaps.push([door.startPos, door.height]);
    }
    EWallGaps.sort(function(gap) {return gap.startPos;});
    var EWallProgress = 0;
    for (var i=0; i<EWallGaps.length; i++) {
        result.push([width-wallThickness, EWallProgress, wallThickness, EWallGaps[i][0]-EWallProgress]);
        EWallProgress += EWallGaps[i][0]+EWallGaps[i][1];
    }
    result.push([width-wallThickness, EWallProgress, wallThickness, height-EWallProgress]);

    // South Wall:
    var SWallGaps = [];
    for (var i=0; i<this.southDoors.length; i++) {
        var door = this.southDoors[i];
        SWallGaps.push([door.startPos, door.width]);
    }
    SWallGaps.sort(function(gap) {return gap.startPos;});
    var SWallProgress = 0;
    for (var i=0; i<SWallGaps.length; i++) {
        result.push([SWallProgress, height-wallThickness, SWallGaps[i][0]-SWallProgress, wallThickness]);
        SWallProgress += SWallGaps[i][0]+SWallGaps[i][1];
    }
    result.push([SWallProgress, height-wallThickness, width-SWallProgress, wallThickness]);

    // West Wall:
    var WWallGaps = [];
    for (var i=0; i<this.westDoors.length; i++) {
        var door = this.westDoors[i];
        WWallGaps.push([door.startPos, door.height]);
    }
    WWallGaps.sort(function(gap) {return gap.startPos;});
    var WWallProgress = 0;
    for (var i=0; i<WWallGaps.length; i++) {
        result.push([0, WWallProgress, wallThickness, WWallGaps[i][0]-WWallProgress]);
        WWallProgress += WWallGaps[i][0]+WWallGaps[i][1];
    }
    result.push([0, WWallProgress, wallThickness, height-WWallProgress]);

    return result;
}


/*
    Game Objects
    ------------
    For testing:
        Obstacles are Blue
        Items are Yellow
        Characters are Black
*/




var PuzzlePeice1_1 = new PuzzlePeice("puzOb2_1", 190,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice1_2 = new PuzzlePeice("puzOb2_2", 235,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice1_3 = new PuzzlePeice("puzOb2_3", 280,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);

var item1_1 = new picItem("item1_1", "Magic Mushrooms", mushPic);
var item1_2 = new picItem("item1_1", "Secret Squirrel", ssPic); // -------------------------
var powerUp1 = new picItem("powerup", "Power Up 1", heartPic, width-wallThickness-30, (height/2)-50, 30, 30, "yellow");
var obstacle1_1 = new picObstacle("ob1_1", bushPic, 50,180,40,40);
var obstacle1_2 = new picObstacle("ob1_2", bushPic, 90,90,60,60, item1_2);
var obstacle1_3 = new picObstacle("ob1_3", bushPic, 250,250,80, 80);

var npc1_1 = new NPC("npc1_1","Grand Wizard Malcom", 450,450,40, 40, "black", "Hello Thor", [[{speaker:"Thor", speech:"Hello", speech1:" ", speech2:" ", speech3:" " }, {speaker:"Npc", speech:"I have some magic mushrooms", speech1: "to make your quest more interesting ", speech2: "please take them from me (I button)", speech3:" "}], [{speaker:"npc", speech:"I am not giving you any more magic mushrooms,", speech1: "this is a quest not a party", speech2: "go and solve the puzzle!", speech3:" "}, {speaker:"Thor", speech:"Meanie", speech1:" ", speech2:" ", speech3:" "}], []], item1_1);
var npc1_2 = new NPC("npc1_2","Lazy Wizard Bert", 550,450,40, 40, "black", "Hello Thor", [[{speaker:"Thor", speech:"Hello", speech1:" ", speech2:" ", speech3:" "}, {speaker:"Npc", speech:"You MUST complete puzzle to obtain", speech1: "the key for the door so you can begin", speech2: "your quest! Use the P key", speech3:" "}, { speaker:"Npc", speech:"to change each brown puzzle element to", speech1:"white. Remember to come back to", speech2: "speak to me, after you have completed", speech3:"the puzzle!"}, {speaker:"Thor", speech:"Oh, thanks, will do", speech1:" ", speech2:" ", speech3:" "}], [], [{speaker:"npc", speech:"I see you have completed the puzzle", speech1: "and have opened the door!", speech2: "Good luck on your quest dear boy", speech3:" "}, {speaker:"Thor", speech:"Who are you calling 'boy' sunshine?", speech1:" ", speech2:" ", speech3:" "}, {speaker:"npc", speech:"Oh,", speech1: "get on with your quest", speech2: "before I magic you into a donkey", speech3:" "}, {speaker:"Thor", speech:"Eeeek! I'll be off!", speech1:" ", speech2:" ", speech3:" "}]]);

var key1_1 = new picItem("key", "Magic Key 1",keyPic);

var key2_1 = new picItem("key", "Magic Key 1",keyPic, 350,350,40, 40, "yellow");
var npc2_1 = new NPC("npc2_1", "Junior Wizard Colin", 450,450,40, 40, "black", "Hello Thor", [[{speaker: "npc", speech:"To leave this room you will need the key up there (yellow block), this key opens the door in the current room, but sometimes they open doors in future rooms too!"}, {speaker: "Thor", speech:"Hmmm *strokes chin*, very interesting - I will remember that"}, {speaker: "Thor", speech:"Cheers Big Ears"}], [], [{speaker: "npc", speech:"You have the key, now on with your quest!"}, {speaker: "npc", speech:"And don't call me big ears!"}]]);


var PuzzlePeice3_1 = new PuzzlePeice("puzOb2_1", 190,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice3_2 = new PuzzlePeice("puzOb2_2", 235,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice3_3 = new PuzzlePeice("puzOb2_3", 280,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice3_4 = new PuzzlePeice("puzOb2_4", 325,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice3_5 = new PuzzlePeice("puzOb2_5", 370,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);

var key3_1 = new picItem("key", "Magic Key 2", keyPic);
var key3_2 = new picItem("key", "Magic Key 3", keyPic, 350,350,40, 40, "yellow");
var npc3_1 = new NPC("npc3_1", "Wizard Bert", 450,450,40, 40, "black", "Hello Thor", [[{speaker: "npc", speech:"You need to complete the puzzle above for the key to the centre door (in the next room) to appear in the next room!"}, {speaker: "npc", speech:"To leave this room you will need the key I have, please take it"}], [{speaker: "npc", speech:"You have the key now, you can continue your quest"}, {speaker: "Thor", speech:"Smashing!"}]], key3_1);
var obstacle3_1 = new picObstacle("ob3_1", bushPic, 30,30,40,40, "red");
var item3_1 = new Item("item3_1", "Item (could have been a key) Placed by Puzzle", 150,150,20, 20, "Yellow");

/* This first room is the top-left of the square - so it has an ID of "NW".
It will just have a door to the East, connecting to room "NE" */

var NWDoorE = new EWallDoor(30, 80);
NWDoorE.doorID = "NWDoorE";
NWDoorE.pointer = ["NE", "NEDoorW"];
var NWTile = new MapTile("NW", [NWDoorE], [key1_1, powerUp1], [npc1_1, npc1_2], [obstacle1_1, obstacle1_2, obstacle1_3], [xOscillator, randomMover], "#02b109", "black"); // honouring Bim's original choice of colour!


// NE tile will have doors to the West and South
var NEDoorW = new WWallDoor(30, 70);
NEDoorW.doorID = "NEDoorW";
NEDoorW.pointer = ["NW", "NWDoorE"];
var NEDoorS = new SWallDoor (width-120, 100);
NEDoorS.doorID = "NEDoorS";
NEDoorS.pointer = ["SE", "SEDoorN"];
var NETile = new MapTile("NE", [NEDoorW, NEDoorS], [key2_1], [npc2_1], [], [], "red", "green"); //my own colour choices are more boring ;)


// similary SE tile will have doors to North and West
var SEDoorN = new NWallDoor(width-120, 100);
SEDoorN.doorID = "SEDoorN";
SEDoorN.pointer = ["NE", "NEDoorS"];
var SEDoorW = new WWallDoor(height/2 - 100, 200);
SEDoorW.doorID = "SEDoorW";
SEDoorW.pointer = ["SW", "SWDoorE"];
var SETile = new MapTile("SE", [SEDoorN, SEDoorW], [], [npc3_1], [obstacle3_1], [itsFollowingMe], "blue", "yellow");

// finally a SW tile with only a door to the East (the whole map is a bent path of 4 rooms, not a circuit)
var SWDoorE = new EWallDoor(height/2 - 100, 200);
SWDoorE.doorID = "SWDoorE";
SWDoorE.pointer = ["SE", "SEDoorW"];
// let's add a centre door to this tile, for some fun and to see if it works. It will take the player back to the
// first (NW) tile,
var SWCentreDoor = new CentreDoor(width/2 - 20, 2*height/3, width/2 + 20, 3*height/4, "red");
SWCentreDoor.doorID = "SWCentreDoor";
SWCentreDoor.pointer = ["NW", "NWDoorE"];
var SWTile = new MapTile("SW", [SWDoorE, SWCentreDoor], [], [], [], [funnyPath], "blue", "hotpink");


//Adding in puzzles!

//Adding a key to unlock door
//1) define the key to unlock door
//2) lock the door
//Locks/Unlocks door on first screen
key1_1.unlocks = NWDoorE;
NWDoorE.locked = true;

key2_1.unlocks = NEDoorS;
NEDoorS.locked = true;

key3_1.unlocks = SEDoorW;
SEDoorW.locked = true;

key3_2.unlocks = SWCentreDoor;
SWCentreDoor.locked = true;


//PUZZLE - changing NPC chat after puzzle completion
//1) Put a new array of conversation in the NPC conversation array
//2) Create the puzzle peices, then add them
//3) Give the id of the NPC whos convo needs to change
NWTile.PuzzlePeices = [PuzzlePeice1_1, PuzzlePeice1_2, PuzzlePeice1_3];
NWTile.PuzzleComplete = false;
NWTile.newChatNPC_id = "npc1_2";




//PUZZLE - adding item after puzzle completion
//1) Create the seperate puzzle pieces
//2) Create the item to add
//3) Add the seperate puzzle pieces into PuzzlePieces array
//4) Set which map on which item is to appear
//4) Assign item to be placed
//NETile.PuzzlePeices = [PuzzlePeice2_1, PuzzlePeice2_2];

SETile.PuzzlePeices = [PuzzlePeice3_1, PuzzlePeice3_2, PuzzlePeice3_3, PuzzlePeice3_4, PuzzlePeice3_5];
SETile.PuzzleComplete = false;
SETile.targetMapTile = SWTile;
SETile.itemToPlace = key3_2;




