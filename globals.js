// canvases

// colours
//var floorGreen = ;
var wallGrey = "#f4f4f4";

// lower canvas
var lowerCanvas = document.getElementById("lowerCanvas");
var ctz = lowerCanvas.getContext("2d");

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

//variables for speach shown in lower screen
var underText1 = "Welcome Adventurer";
var underText2 = "";
var underText3 = "";
var underText4 = "";
var underText5 = "";
var underText6 = "";

var thor_next_to = "nothing";

// graphics for obstacles
var bushPic = new Image(); 
bushPic.src = 'assets/obstacles/bush.png';
// grahics for items

var liconPic = new Image(); //lightening icon for health bar
liconPic.src = 'assets/items/lightening.png';

var keyPic = new Image(); //key
keyPic.src = 'assets/items/key_sm.png';

var mushPic = new Image(); //mushrooms
mushPic.src = 'assets/items/mushroom.png';

var ssPic = new Image(); //secret squiril
ssPic.src = 'assets/items/squiril.png';

var heartPic = new Image(); //heart for power up
heartPic.src = 'assets/items/heart.png';

var spiderPic = new Image(); //spider
spiderPic.src = 'assets/spider/spider.png';

var giantPic = new Image(); //ice Giant currently looking down (s) giants are not currently animated but ther is the graphics to do it 
giantPic.src = 'assets/giant/giant_one_s.png';


// graphics for NPC's
var npcPic = new Image(); //  
npcPic.src = 'assets/npc/wiz1.png';
