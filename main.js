pieceSize = 100; // width = height;
chessType = true;
var canvas = document.getElementById("myCanvas");
canvas.addEventListener("click", canvasOnClick, false);
canvas.width = 400;
canvas.height = 600;
var ctx = canvas.getContext("2d");


var my_gradient=ctx.createLinearGradient(0,0,0,500);
my_gradient.addColorStop(0,"white");
my_gradient.addColorStop(1,"green");
ctx.fillStyle=my_gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height); 

ctx.strokeText("Score: --",0, 20);
ctx.strokeText("Ply: --", 0, 40);
//ctx.clearRect(0,0,100,100);


ctx.beginPath();
/* vertical lines */
for (var x = 0; x <= canvas.width; x += pieceSize) {
    ctx.moveTo(x, pieceSize);
    ctx.lineTo(x, canvas.height);
}

/* horizontal lines */
for (var y = pieceSize; y <= canvas.height; y += pieceSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
}
ctx.stroke();

function canvasOnClick(e){
    var cell = getCursorPosition(e);
    if(cell.row == 0) return; // leave the first line empty

    ctx.beginPath();
    ctx.arc(cell.column*100 + 50, 
            cell.row*100 + 50, 50, 0, 2*Math.PI, false);
    if( chessType == true){
        ctx.fillStyle = "#0A0000";
        chessType = false;
    }
    else{
        ctx.fillStyle = "#FF3030";
        chessType = true;
    }
    ctx.fill();
    ctx.stroke();
}

function Cell(row, column) {
    this.row = row;
    this.column = column;
}

function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX != undefined && e.pageY != undefined) {
	x = e.pageX;
	y = e.pageY;
    }
    else {
	x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
	y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;
    var cell = new Cell(Math.floor(y/pieceSize),
                        Math.floor(x/pieceSize));
    return cell;
}
