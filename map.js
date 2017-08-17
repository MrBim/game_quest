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
        NWallProgress = NWallGaps[i][0]+NWallGaps[i][1];
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
        EWallProgress = EWallGaps[i][0]+EWallGaps[i][1];
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
        SWallProgress = SWallGaps[i][0]+SWallGaps[i][1];
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
        WWallProgress = WWallGaps[i][0]+WWallGaps[i][1];
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

// ACTUAL prototype map starts construction here!

// generate random colours in order to randomise first puzzle colours (means the player always has to
// look and can't just always know the answer :) 
var randColNW = ["red", "yellow", "green", "blue"][Math.floor(Math.random()*4)];
var randColNE = ["red", "yellow", "green", "blue"][Math.floor(Math.random()*4)];
var randColSW = ["red", "yellow", "green", "blue"][Math.floor(Math.random()*4)];
var randColSE = ["red", "yellow", "green", "blue"][Math.floor(Math.random()*4)];

// first room has one puzzle, one NPC, and 3 exits. 2 to the North which lead into the same room, and one to the East
// which is locked.

// doors:
var startTileNorthDoor1 = new NWallDoor(wallThickness+200, 100);
startTileNorthDoor1.doorID = "startTileNorthDoor1";
startTileNorthDoor1.pointer = ["twinRoom", "twinRoomDoor1"];
var startTileNorthDoor2 = new NWallDoor(width-wallThickness-300, 100);
startTileNorthDoor2.doorID = "startTileNorthDoor2";
startTileNorthDoor2.locked = true;
startTileNorthDoor2.pointer = ["twinRoom", "twinRoomDoor2"];
var startTileLockedDoor = new EWallDoor((height-100)/2, 100);
startTileLockedDoor.doorID = "startTileLockedDoor";
startTileLockedDoor.pointer = ["maze", "mazeDoorW"];
startTileLockedDoor.locked = true;
var helpfulGuy = new NPC("wizardGuy", "Just a wizard", 300, 500, 40, 40, "black",
    "Don't mind me.", [[{speaker: "Thor", speech: "Come again?"},
    {speaker: "Npc", speech: "Oh, nothing. You'll notice that there are", speech1: "a few locked doors around - ",
    speech2: "but I think there's something you should", speech3: "be able to do to get through them."},
    {speaker: "Thor", speech: "Well, thanks your help I guess..."},
    {speaker: "Npc", speech: "Don't mention it.", speech1: "Although you will thank me for telling", speech2: "you of the dangerous enemies you will", speech3: "encounter."},
    {speaker: "Thor", speech: "Pah! Don't talk to me about danger!", speech1: "You do know that I'm a powerful god?", speech2: "A few of my lightning bolts can strike down", speech3: "down any puny giants!"},
    {speaker: "Npc", speech: "Really? And what about spiders?"},
    {speaker: "Thor", speech: "Yep, they fry spiders quite nicely."},
    {speaker: "Npc", speech: "But you must remember that as soon as", speech1: "you are hurt, you are unable to fire", speech2: "your magic lightning."},
    {speaker: "Thor", speech: "Yeah yeah, whatever."},
    {speaker: "Npc", speech: "And even when you can fire, you have to", speech1: "be careful! If you try to fire again", speech2: "when 3 bolts are already out - the", speech3: "oldest one disappears!"},
    {speaker: "Thor", speech: "Yah yah yah. And if I get hurt, I can", speech1: "use this sword. It's pretty sharp. Mind", speech2: "if I demonstrate on you?"},
    {speaker: "Npc", speech: "Yikes! Please, please, no.", speech1: "It's very sharp - but you need to be", speech2: "close to your enemy to use it. About as", speech3: "close as you are to me now..."},
    {speaker: "Thor", speech: "Haha, you remember that!"},
    {speaker: "Npc", speech: "Just remember that the lightning is way", speech1: "better. So if you get hurt, you should", speech2: "look for a red healing heart."},
    {speaker: "Thor", speech: "Thank you, I will bear that in mind.", speech1: "Luckily for you I have more important", speech2: "things to do today than hack off wizards'", speech3: "heads."},
    {speaker: "Npc", speech: "Phew!"}]]);
// puzzle-pieces. Will cycle through 4 values. There will be one in each corner of the room, and the correct values
// can only be found by comparing against the similar "obstacles" seen in the corners of the inaccessible half of
// the upper room.
// This is a bit lame as a puzzle, but is the best I can come up with right now, based on the current code :)
var ghostKey = new Item("key", "key");
ghostKey.unlocks = startTileNorthDoor2;
var NWPuzzlePiece = new PuzzlePeice("NW", wallThickness, wallThickness, 40, 40, "brown", randColNW, ["red", "yellow", "green", "blue"]);
var NEPuzzlePiece = new PuzzlePeice("NE", width-wallThickness-40, wallThickness, 40, 40, "brown", randColNE, ["red", "yellow", "green", "blue"]);
var SWPuzzlePiece = new PuzzlePeice("SW", wallThickness, height-wallThickness-40, 40, 40, "brown", randColSW, ["red", "yellow", "green", "blue"]);
var SEPuzzlePiece = new PuzzlePeice("SE", width-wallThickness-40, height-wallThickness-40, 40, 40, "brown", randColSE, ["red", "yellow", "green", "blue"]);
var startTile = new MapTile("startingTile", [startTileNorthDoor1, startTileNorthDoor2, startTileLockedDoor], [ghostKey],
    [helpfulGuy], [], [], "black", "white");
startTile.PuzzlePeices = [NWPuzzlePiece, NEPuzzlePiece, SWPuzzlePiece, SEPuzzlePiece];

// room to the North of start Tile - I call it the "twin room" because it is really 2 rooms in one, with a huge
// obstacle right down the middle!

// doors: only ones linking to starting tile
var twinRoomDoor1 = new SWallDoor(wallThickness+200, 100);
twinRoomDoor1.doorID = "twinRoomDoor1";
twinRoomDoor1.pointer = ["startingTile", "startTileNorthDoor1"];
var twinRoomDoor2 = new SWallDoor(width-wallThickness-300, 100);
twinRoomDoor2.doorID = "twinRoomDoor2";
twinRoomDoor2.pointer = ["startingTile", "startTileNorthDoor2"];
// the all-important full-length obstacle!
var dividingWall = new Obstacle("wall", (width-80)/2, wallThickness, 80, height-2*wallThickness, "white");
// items: a key, behind the locked door!
var startKey = new picItem("key", "Key", keyPic, width-wallThickness-270, (height-40)/2, 40, 40);
startKey.unlocks = startTileLockedDoor;
// obstacles - which code for the puzzle solution in the first tile:
var NWPuzzleKey = new Obstacle("NWPuzzleKey", (width+80)/2, wallThickness, 20, 20, randColNW);
var NEPuzzleKey = new Obstacle("NEPuzzleKey", width-wallThickness-20, wallThickness, 20, 20, randColNE);
var SWPuzzleKey = new Obstacle("SWPuzzleKey", (width+80)/2, height-wallThickness-20, 20, 20, randColSW);
var SEPuzzleKey = new Obstacle("SEPuzzleKey", width-wallThickness-20, height-wallThickness-20, 20, 20, randColSE);
startKey.unlocks = startTileLockedDoor;
// enemies:
var giant1 = new picEnemy("giant", 200, 200, 40, 40, giantPic, 2, moveTowardsThor, 4);
var spider1 = new picEnemy("spider", 800, 300, 40, 40, spiderPic, 5, randomMovement(10), 8);
var twinRoom = new MapTile("twinRoom", [twinRoomDoor1, twinRoomDoor2], [startKey], [], [dividingWall, NWPuzzleKey, NEPuzzleKey, SWPuzzleKey, SEPuzzleKey], [giant1, spider1], "brown", "white");

// third room. Going to try playing about with some "switches". (Basically obstacles that you can interact with)
// they will change the position of other obstacles, allowing you to progress to different parts of the tile
var mazeDoorW = new WWallDoor((height-100)/2, 100);
mazeDoorW.doorID = "mazeDoorW";
mazeDoorW.pointer = ["startingTile", "startTileLockedDoor"];
var mazeDoorE = new EWallDoor((height-100)/2, 100);
mazeDoorE.doorID = "mazeDoorE";
mazeDoorE.pointer = ["enemies", "enemiesWestDoor"];
// items: will need a powerup to make sure lightning is able to be fired!
var mazePowerUp = new picItem("powerup", "mazePowerUp", heartPic, width/2-80, height-80, 40, 40);
// obstacles (a lot!):
// first actual maze walls
var wall1N = new Obstacle("mazeWall1N", 200, wallThickness+31, wallThickness, height/2-wallThickness-31, "white");
var wall1S = new Obstacle("mazeWall1S", 200, height/2, wallThickness, height/2-wallThickness, "white");
var wall2N = new Obstacle("mazeWall2N", 400, wallThickness+31, wallThickness, 89-wallThickness, "white");
var wall2S = new Obstacle("mazeWall2S", 400, 120, wallThickness, height-wallThickness-220, "white");
var wall3W = new Obstacle("mazeWall3W", 231+wallThickness, height-wallThickness-100, 69-wallThickness/2, wallThickness, "white");
var wall3E = new Obstacle("mazeWall3E", 300+wallThickness/2, height-wallThickness-100, width-360-3*wallThickness/2, wallThickness, "white");
var wall4 = new Obstacle("mazeWall4", 400+wallThickness, 150, width-400-2*wallThickness, wallThickness, "white");
var wall5W = new Obstacle("mazeWall5W", 400+wallThickness, 450, width/2-230-wallThickness, wallThickness, "white");
var wall5E = new Obstacle("mazeWall5E", 230+width/2, 450, width/2-230-wallThickness, wallThickness, "white");
var wall6 = new Obstacle("mazeWall6", 200+wallThickness, wallThickness+31, 200-wallThickness, wallThickness, "white");
// now the "switches" which open and close the gaps in the walls;
var switch1 = new Obstacle("switch1", (200-wallThickness)/2-10, wallThickness, 20, 20, "red");
var switch2 = new Obstacle("switch2", 200+wallThickness, 150, 20, 20, "red");
var switch3 = new Obstacle("switch3", 400+wallThickness, 450+wallThickness, 20, 20, "red");
switch1.action = function() {
    wall1N.height = (wall1N.height==height/2-wallThickness-31 ? height/2-wallThickness-60 : height/2-wallThickness-31);
    wall1S.yPos = (wall1S.yPos==height/2 ? height/2+30 : height/2);
    wall1S.height = (wall1S.height==height/2-wallThickness ? height/2-wallThickness-30 : height/2-wallThickness);
    wall5W.width = (wall5W.width==width/2-230-wallThickness ? width/2-200/wallThickness : width/2-230-wallThickness);
    wall5E.xPos = (wall5E.xPos==230+width/2 ? 200+width/2 : 230+width/2);
    wall5E.width = (wall5E.width==width/2-230-wallThickness ? width/2-200-wallThickness : width/2-230-wallThickness);
};
switch2.action = function() {
    wall3W.width = (wall3W.width==69-wallThickness/2 ? 39-wallThickness/2 : 69-wallThickness/2);
    wall3E.xPos = (wall3E.xPos==300+wallThickness/2 ? 330+wallThickness/2 : 300+wallThickness/2);
    wall3E.width = (wall3E.width==width-360-3*wallThickness/2 ? width-330-3*wallThickness/2 : width-360-3*wallThickness/2);
};
switch3.action = function() {
    wall2N.height = (wall2N.height==89-wallThickness ? wallThickness : 89-wallThickness);
    wall2S.yPos = (wall2S.yPos==120 ? 150 : 120);
    wall2S.height = (wall2S.height==height-wallThickness-220 ? height-wallThickness-250 : height-wallThickness-220);
}
var maze = new MapTile("maze", [mazeDoorW, mazeDoorE], [mazePowerUp], [], [wall1N, wall1S, wall2N, wall2S, wall3W, wall3E, wall4, wall5W, wall5E, wall6, switch1, switch2, switch3], [], "black", "white");

// 4th tile (final one for prototype): consists of several enemies, mostly giants who follow you, and have a ton of
// health. The way to get past is to hide behind conveniently placed obstacles. There will be some spiders too!
// only one door:
var enemyDoorW = new WWallDoor((height-100)/2, 100);
enemyDoorW.doorID = "enemiesWestDoor";
enemyDoorW.pointer = ["maze", "mazeDoorE"];
// npc just to tell you that you've finished!
var finishConfirm = new NPC("finishGuy", "A wise old wizard", width-wallThickness-40, (height-40)/2, 40, 40, "black", "Greetings Thor.", 
    [[{speaker: "NPC", speech: "You have completed this simple short", speech1: "adventure!"},
    {speaker: "Thor", speech: "Thanks, wizardy wise dude!"},
    {speaker: "NPC", speech: "Be sure to check out the full game,", speech1:"when those lazy developers finally make it."}]]);
// enemies!! One super-giant in each corner, and one really annoying spider!
var NWGiant = new picEnemy("NWgiant", wallThickness+10, wallThickness+10, 40, 40, giantPic, 2., moveTowardsThor, 20);
var NEGiant = new picEnemy("NEgiant", width-wallThickness-50, wallThickness+10, 40, 40, giantPic, 2.8, moveTowardsThor, 20);
var SWGiant = new picEnemy("SWgiant", wallThickness+10, height-wallThickness-50, 40, 40, giantPic, 2.8, moveTowardsThor, 20);
var SEGiant = new picEnemy("SEgiant", width-wallThickness-50, height-wallThickness-50, 40, 40, giantPic, 2.8, moveTowardsThor, 20);
var spider2 = new picEnemy("spider2", 150+wallThickness, (height-40)/2, 40, 40, spiderPic, 5, randomMovement(5), 10);
// all-important obstacles!
// first a couple of walls to "shield" you right by the entrance
var shieldWall1 = new Obstacle("shieldWall1", wallThickness, (height-100)/2-wallThickness, 100, wallThickness, "white");
var shieldWall2 = new Obstacle("shieldWall2", wallThickness, (height+100)/2, 100, wallThickness, "white");
var SWHidingPlaceHorizontal = new Obstacle("SWHidingPlaceHorizontal", wallThickness+200, (height+150)/2, 200, wallThickness, "white");
var SWHidingPlaceVertical = new Obstacle("SWHidingPlaceVertical", wallThickness+200, (height+150)/2+wallThickness, wallThickness, 150, "white");
var SEHidingPlaceHorizontal = new Obstacle("SEHidingPlaceHorizontal", width-wallThickness-300, (height+150)/2, 200, wallThickness, "white");
var SEHidingPlaceVertical = new Obstacle("SEHidingPlaceVertical", width-2*wallThickness-100, (height+150)/2+wallThickness, wallThickness, 150, "white");
var NWHidingPlaceHorizontal = new Obstacle("NWHidingPlaceHorizontal", wallThickness+200, (height-150)/2-wallThickness, 200, wallThickness, "white");
var NWHidingPlaceVertical = new Obstacle("NWHidingPlaceVertical", wallThickness+200, (height-450)/2, wallThickness, 150, "white");
var NEHidingPlaceHorizontal = new Obstacle("NEHidingPlaceHorizontal", width-wallThickness-300, (height-150)/2-wallThickness, 200, wallThickness, "white");
var NEHidingPlaceVertical = new Obstacle("NEHidingPlaceVertical", width-2*wallThickness-100, (height-450)/2, wallThickness, 150, "white");
var CentreVertical = new Obstacle("CentreVertical", (width-wallThickness)/2, (height-300)/2, wallThickness, 300, "white");
var CentreHorizontal = new Obstacle("CentreHorizontal", (width-300)/2, (height-wallThickness)/2, 300, wallThickness, "white");
var enemyTile = new MapTile("enemies", [enemyDoorW], [], [finishConfirm], [shieldWall1, shieldWall2,  SWHidingPlaceHorizontal, SWHidingPlaceVertical, SEHidingPlaceHorizontal, SEHidingPlaceVertical, NWHidingPlaceHorizontal, NWHidingPlaceVertical, NEHidingPlaceHorizontal, NEHidingPlaceVertical, CentreVertical, CentreHorizontal], [NWGiant, NEGiant, SWGiant, SEGiant, spider2], "black", "white");
