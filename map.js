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


var item1_1 = new Item("item", "Magic Key", 350,350,40, 40, "yellow");

var item1_2 = new Item("item1_2", "Magic Potion");
var item1_3 = new Item("item1_3", "Magic Mushroom");
var item1_4 = new Item("item1_4", "Secret Squirrel");

var PuzzlePeice1_1 = new PuzzlePeice("puzOb2_1", 190,100,40,40, "#d85504", "#ffffff", ["#ffffff","#e2a77a","#e0782a"]);
var PuzzlePeice1_2 = new PuzzlePeice("puzOb2_2", 235,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);
var PuzzlePeice1_3 = new PuzzlePeice("puzOb2_3", 280,100,40,40, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);

var powerUp1 = new Item("powerup", "Power Up 1", width-wallThickness-30, (height/2)-50, 30, 30, "yellow");
var obstacle1_1 = new Obstacle("ob1_1", 50,180,40,40, "blue");
var obstacle1_2 = new Obstacle("ob1_2", 90,90,60,60, "blue", item1_4);
var obstacle1_3 = new Obstacle("ob1_3", 250,250,80, 80, "blue");
var npc1_1 = new NPC("npc1_1", "Wizard Dave", 550,550,40, 40, "black", "Greetings Thor", [[{speaker:"Thor", speech:"Hello"}, {speaker:"npc", speech:"I have a magic potion for you, please take it"}], [{speaker:"npc", speech:"I have given you the magic potion, stop *&!*&*^% pestering me! On your way!"}]], item1_2);
var npc1_2 = new NPC("npc1_2","Grand Wizard Malcom", 450,450,40, 40, "black", "Hello Thor", [[{speaker:"Thor", speech:"Warm Salutations to you"}, {speaker:"Npc", speech:"I have some magic mushrooms to make your quest more interesting, please take them"}], [{speaker:"npc", speech:"I am not giving you any more magic mushrooms, this is a quest not a party"}, {speaker:"Thor", speech:"Awww maaan, your meeeeeean!"}], [{speaker:"npc", speech:"I see you have completed the puzzle, are you willing listen to my panpipes?"}, {speaker:"Thor", speech:"Sure, not a very wizardy thing to do though, shouldn't you be focussed on growing your beard and stirring boiling herbs in your cauldron?"}, {speaker:"npc", speech:"I am a performing artist trapped in the body of a wizard"}, {speaker:"Thor", speech:"Oh, right...Well crack on, I haven't got all day"}, {speaker:"npc", speech:"As you are letting me do this, I will let you know that on your quest you need to turn two brown looking obstacles of different sizes white, which will allow you to obtain the mystical homemade headband further on in your quest (it will appear as a yellow object in beta)"}, {speaker:"Thor", speech:"OK, thanks for the info. Actually, might not hang around for the panpipes, sounds awful, laters!"}]], item1_3);



var key2_1 = new Item("key", "Magic Key 1", 150,150,20, 20, "Yellow");
var key2_2 = new Item("key", "Magic Key 2", 125,150,20, 20, "Yellow");
var item2_1 = new Item("item2_1", "Magic Glove", 250,250,40, 40, "Yellow");
var item2_2 = new Item("item2_2", "Magic Boot");

var PuzzlePeice2_1 = new PuzzlePeice("puzOb2_1", 500,500,140,140, "#d85504", "#ffffff", ["#ffffff","#e2a77a","#e0782a"]);
var PuzzlePeice2_2 = new PuzzlePeice("puzOb2_2", 400,100,30,60, "#d85504", "#ffffff", ["#ffffff","#ddb89b","#e2a77a", "#e09257","#e0782a"]);

var npc2_1 = new NPC("npc2_1", "Junior Wizard Colin", 450,450,40, 40, "black", "none", [[{speaker: "npc", speech:"I have a magic boot which is essential for your quest"}, {speaker: "Thor", speech: "A boot? Seriously!?!"}, {speaker: "npc", speech:"Yes, be safe a take it with you"}], [{speaker: "npc", speech:"I've given you the boot, now scoot!"}]], item2_2);
var npc2_2 = new NPC("npc2_2","Advance Wizard Jeff", 350,450,40, 40, "black", "none", [[{speaker: "npc", speech:"I'm not very chatty and have nothing for you"}, {speaker: "Thor", speech: "Oh!"}, {speaker: "npc", speech:"Try to take something"}]]);

var item3_1 = new Item("item3_1","Gold Trophy", 350,350,40, 40, "Yellow");
var item3_2 = new Item("item3_1","Magic Banjo");
var obstacle3_1 = new Obstacle("ob3_1", 10,10,40,40, "red", item3_2);
var item3_3 = new Item("item2_1", "Mystical Homemade Headband", 250,250,40, 40, "Yellow");

// try to construct basic map. Will be square, but without doors in all the obvious places!
// note that there are no items or characters for now!

/* This first room is the top-left of the square - so it has an ID of "NW".
It will just have a door to the East, connecting to room "NE" */

var NWDoorE = new EWallDoor(30, 80);
NWDoorE.doorID = "NWDoorE";
NWDoorE.pointer = ["NE", "NEDoorW"];
var NWTile = new MapTile("NW", [NWDoorE], [item1_1, powerUp1], [npc1_1, npc1_2], [obstacle1_1, obstacle1_2, obstacle1_3], [xOscillator, randomMover], "#02b109", "black"); // honouring Bim's original choice of colour!


// NE tile will have doors to the West and South
var NEDoorW = new WWallDoor(30, 70);
NEDoorW.doorID = "NEDoorW";
NEDoorW.pointer = ["NW", "NWDoorE"];
var NEDoorS = new SWallDoor (width-120, 100);
NEDoorS.doorID = "NEDoorS";
NEDoorS.pointer = ["SE", "SEDoorN"];
var NETile = new MapTile("NE", [NEDoorW, NEDoorS], [key2_1, key2_2, item2_1, item2_2], [npc2_1, npc2_2], [], [triangulator], "red", "green"); //my own colour choices are more boring ;)


//Adding a key to unlock door    
key2_1.unlocks = NEDoorW;
key2_2.unlocks = NEDoorS;

NETile.doors[0].locked = true;
NETile.doors[1].locked = true;
console.log(NETile.doors[0].doorID);
console.log(NETile.doors[1].doorID);
//NETile.doors[1].locked = true;


// similary SE tile will have doors to North and West
var SEDoorN = new NWallDoor(width-120, 100);
SEDoorN.doorID = "SEDoorN";
SEDoorN.pointer = ["NE", "NEDoorS"];
var SEDoorW = new WWallDoor(height/2 - 100, 200);
SEDoorW.doorID = "SEDoorW";
SEDoorW.pointer = ["SW", "SWDoorE"];
var SETile = new MapTile("SE", [SEDoorN, SEDoorW], [item3_1], [], [obstacle3_1], [itsFollowingMe], "blue", "yellow");

// finally a SW tile with only a door to the East (the whole map is a bent path of 4 rooms, not a circuit)
var SWDoorE = new EWallDoor(height/2 - 100, 200);
SWDoorE.doorID = "SWDoorE";
SWDoorE.pointer = ["SE", "SEDoorW"];
// let's add a centre door to this tile, for some fun and to see if it works. It will take the player back to the
// first (NW) tile,
var SWCentreDoor = new CentreDoor(width/2 - 20, 2*height/3, width/2 + 20, 3*height/4, "red");
SWCentreDoor.doorID = "SWCentreDoor";
SWCentreDoor.pointer = ["NW", "NWDoorE"];
var SWTile = new MapTile("SW", [SWDoorE, SWCentreDoor], [], [], [], [funnyPath], "yellow", "hotpink");



//PUZZLE - chaning NPC chat after puzzle completion
NWTile.PuzzlePeices = [PuzzlePeice1_1, PuzzlePeice1_2, PuzzlePeice1_3];
NWTile.PuzzleComplete = false;
NWTile.newChatNPC_id = "npc1_2";

//PUZZLE - adding item after puzzle completion
NETile.PuzzlePeices = [PuzzlePeice2_1, PuzzlePeice2_2];
NETile.PuzzleComplete = false;
NETile.targetMapTile = SETile;
NETile.itemToPlace = item3_3;




