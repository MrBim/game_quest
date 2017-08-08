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


// grahics for items
var keyPic = new Image();
keyPic.src = 'assets/items/key_sm.png';

var spiderPic = new Image();
spiderPic.src = 'assets/spider/spider.png';

var giantPic = new Image();
giantPic.src = 'assets/giant/giant_one_s.png';
