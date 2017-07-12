// map definition code (first attempt!)

// note that the below global vars have to be moved here to get things to run!

// canvas variables
var width = 1000;
var height = 700; 
var heightTwo = 200;
// canvas
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// worldMap is an array which will contain all the individual mapTile objects
var worldMap = [];

/* going to create a simple square map for now, but hopefully easily extensible,
without tying us into using a grid system for everything */

/* constructor for map tile objecst. Each is passed an array of doors, items and characters (in the form of objects)
it also has an ID name (or perhaps number) which identifies it for the purposes of other code which needs
to interact with it (eg doors leading to that room). 

I am also adding a colour property, mainly to allow easy identification of rooms at this early stage. I imagine
that in the final code it will be replaced by an image, or something */
function MapTile (id, doors, items, characters, obsticles, colour) {
    this.id = id;
    this.doors = doors;
    this.items = items;
	this.obsticles = obsticles;
    this.characters = characters;
    this.colour = colour;
    worldMap.push(this);
}

/* door constructor function. Each door has an x and y position (both a "start" and an "end", since I am imagining
the doors as lines for now), a colour in which to draw that line, a doorID (which only needs to be unique within
each tile), and a "pointer" to another door (identified by mapTile and ID) to which it leads when the player walks
through it. I imagine at this stage that pointer will be a 2-element array containing a mapTile id and a door ID

It also has a "draw" method to display it on the screen.

Only the doorId and pointer properties are really part of the logic here - the rest is a convenience for me to test
these things out and should be easily able to be changed in accordance with what we want the roos/doors to look like*/
function Door (doorId, xPos1, yPos1, xPos2, yPos2, colour, pointer) {
    this.doorId = doorId;
    this.xPos1 = xPos1;
    this.yPos1 = yPos1;
    this.xPos2 = xPos2;
    this.yPos2 = yPos2;
    this.middleX = (xPos1 + xPos2)/2;
    this.middleY = (yPos1 + yPos2)/2;
    this.colour = colour;
    this.pointer = pointer;
    this.draw = function() {
        ctx.beginPath();
        ctx.moveTo(this.xPos1, this.yPos1);
        ctx.lineTo(this.xPos2, this.yPos2);
        ctx.lineWidth = 10;
        ctx.strokeStyle = this.colour;
        ctx.stroke();
    }
}


//Obsticles drawn as rectangles, first two numbers are start x and y, third is length, last height (drawn down)
var tree1 = new Obsticle(0,0,40,40, "red");
var tree2 = new Obsticle(90,90,60,60, "red");
var rock = new Obsticle(250,250,80, 80, "blue");


// try to construct basic map. Will be square, but without doors in all the obvious places!
// note that there are no items or characters for now!

/* This first room is the top-left of the square - so it has an ID of "NW".
It will just have a door to the East, connecting to room "NE" */

var NWDoorE = new Door("NWDoorE", width, height/2 - 30, width, height/2 + 30, "brown", ["NE", "NEDoorW"]);
var NWTile = new MapTile("NW", [NWDoorE], [], [], [tree1, tree2, rock],"#02b109"); // honouring Bim's original choice of colour!

// NE tile will have doors to the West and South
var NEDoorW = new Door("NEDoorW", 0, height/2 - 30, 0, height/2 + 30, "yellow", ["NW", "NWDoorE"]);
var NEDoorS = new Door ("NEDoorS", width/2 - 30, height, width/2 + 30, height, "green", ["SE", "SEDoorN"]);
var NETile = new MapTile("NE", [NEDoorW, NEDoorS], [], [], [],"red"); //my own colour choices are more boring ;)

// similary SE tile will have doors to North and West
var SEDoorN = new Door("SEDoorN", width/2 - 30, 0, width/2 + 30, 0, "white", ["NE", "NEDoorS"]);
var SEDoorW = new Door("SEDoorW", 0, height/2 - 30, 0, height/2 + 30, "orange", ["SW", "SWDoorE"]);
var SETile = new MapTile("SE", [SEDoorN, SEDoorW], [], [], [],"blue");

// finally a SW tile with only a door to the East (the whole map is a bent path of 4 rooms, not a circuit)
var SWDoorE = new Door("SWDoorE", width, height/2 - 30, width, height/2 + 30, "brown", ["SE", "SEDoorW"]);
var SWTile = new MapTile("SW", [SWDoorE], [], [], [], "yellow");
