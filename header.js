pieceSize = 100; // width == height;
pieceRadix = 40;
MIN_VALUE = -1000;
MAX_VALUE = 1000;
pieceStatus = {
    EMPTY: 0,
    RED: 1,
    BLACK: -1,
};
rawBoard = new Array(); // save the piece status;

setting = {
    diff: 4, // difficulty level
    moveFirst: pieceStatus.BLACK,
};

function State() {
    this.board = null;
    this.nextColor = 0;
};
function abState(action, terminated, initial){ // save the result of actions
    this.action = action;
    this.terminated = terminated;
    this.value = initial;
};
function copyBoard(board){
    var tmpBoard = board.slice();
    for(var i in board){
        if(board[i] instanceof Array)
            tmpBoard[i] = board[i].slice();
    }
    return tmpBoard;
}

var canvas = document.getElementById("myCanvas");
canvas.width = 400;
canvas.height = 600;
var ctx = canvas.getContext("2d");
ctx.strokeStyle = "#0A0000";
ctx.fillStyle = "#0A0000";

function Cell(row, column) {
    this.row = row;
    this.column = column;
}
