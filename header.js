pieceSize = 100; // width == height;
pieceRadix = 40;
chessType = true;
pieceStatus = {
    EMPTY: 0,
    RED: 1,
    BLACK: -1,
};
board = new Array(); // save the piece status;

var canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 600;
var ctx = canvas.getContext("2d");

function Cell(row, column) {
    this.row = row;
    this.column = column;
}
