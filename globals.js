// canvases

// colours
//var floorGreen = ;
var wallGrey = "#f4f4f4";


// lower canvas
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

//variables for speach shown in lower screen
var underText1 = "Welcome Adventurer";
var underText2 = "";
var underText3 = "";
var underText4 = "";
var underText5 = "";
var underText6 = "";




// grahics for items
var keyPic = new Image();
keyPic.src = 'assets/items/key_sm.png';

