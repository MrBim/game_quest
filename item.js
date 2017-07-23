/*
       Item constructor:
*/


function Item (id, xPos, yPos, width, height, colour) {
    this.type = "Item";
    this.id = id;    
    this.xPos = xPos;
    this.yPos = yPos;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.draw = function() {
        ctx.beginPath();
        ctx.fillStyle=this.colour;
        ctx.rect(this.xPos,this.yPos,this.width,this.height); 
        ctx.fill();
        };
}



