drawBoard();


function initGame(){
    
    initBoard();
    drawBoard();
    engine = new gameEngine(setting.moveFirst);
    canvas.addEventListener("click", canvasOnClick, false);
    document.getElementById("startButton").value = "stop";
    if(setting.moveFirst == pieceStatus.RED)
        computerMove();
}
function finalizeGame(){
    engine = null;
    // initBoard();
    //drawBoard();
    canvas.removeEventListener("click", canvasOnClick);
    document.getElementById("startButton").value = "start";
}

function startButton()
{
    if(document.getElementById("startButton").value == "start"){
        setting.diff = parseInt(document.getElementById("diff").value);
        setting.moveFirst = parseInt(document.getElementById("first").value);
       
        initGame();
    }
    else{
        finalizeGame();
        //document.getElementById("startButton").value = "start";

    }
}

function printStat(score, ply, nodes, maxp, minp, dotree){
    ctx.clearRect(0,0,400,100);
    ctx.font = "20px serif";
    ctx.strokeText("Score: "+score,10, 20);
    ctx.strokeText("Ply: "+ply, 10, 50);
    ctx.strokeText("nodes: "+nodes, 10, 80);
    ctx.strokeText("max prunning: "+maxp, 200, 20);
    ctx.strokeText("min pruning: "+minp, 200, 50);

    ctx.strokeText("depth of tree: "+dotree, 200, 80);
}
function drawBoard(){
    ctx.clearRect(0,0,500,700);
    ctx.font = "20px serif";
    ctx.strokeText("Score: 0",10, 20);
    ctx.strokeText("Ply: 0", 10, 50);

    ctx.strokeText("max prunning: 0", 200,20);
    ctx.strokeText("min pruning: 0", 200, 50);
    ctx.strokeText("nodes: 0", 10,80);
    ctx.strokeText("depth of tree: 0", 200,80);
    //ctx.clearRect(0,0,100,100);
    // ctx.strokeText("Diff", 100, 20);
    ctx.beginPath();
    // // 3 boxes to show the difficulty
    // ctx.fillStyle = "#66FF66";
    // ctx.fillRect(140, 4, 40, 20);
    // ctx.fillStyle = "#0066FF";
    // ctx.fillRect(190, 4, 40, 20);
    // ctx.fillStyle = "#FF3300";
    // ctx.fillRect(240, 4, 40, 20);

    // ctx.strokeStyle = "#000000";
    // ctx.fillStyle = "#FFFFFF";
    // ctx.fillRect(300, 4, 50, 20);
    // ctx.strokeText("Start", 300, 20);
    // ctx.strokeText("Go First: human", 100, 50);
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
}

function initBoard(){
    rawBoard.length = 0;
    for(var i = 0; i < 6; ++i){
        rawBoard[i] = new Array();
        for(var j = 0; j < 4; ++j){
            rawBoard[i].push(pieceStatus.EMPTY);
        }
    }
}

function drawMove(cell){
    var oldStroke = ctx.strokeStyle;
    var oldFill = ctx.fillStyle;
    var res = engine.getNextAction(cell, rawBoard);
    if(res == "") return false;
    var arr = res.pop();
    while(arr!= null){
//        console.log("draw: " + arr);
        ctx.beginPath();
        ctx.arc(arr[1]*100 + 50, 
                arr[0]*100 + 50, pieceRadix, 
                0, 2*Math.PI, false);

        if(arr[2] == pieceStatus.BLACK){
            ctx.strokeStyle = "#0A0000";
            ctx.fillStyle = "#0A0000";
            ctx.fill();
            ctx.stroke();
        }
        else if(arr[2] == pieceStatus.RED){
            ctx.strokeStyle = "#FF3030";
            ctx.fillStyle = "#FF3030";
            ctx.fill();
            ctx.stroke();
        }
        else{
            ctx.clearRect(arr[1]*100+5,
                          arr[0]*100+5,
                          pieceSize-10,
                          pieceSize-10);
        }
        arr = res.pop();
    }
    ctx.strokeStyle = oldStroke;
    ctx.fillStyle = oldFill;
    return true;
}
function canvasOnClick(e){
    
    var cell = getCursorPosition(e);
    if(drawMove(cell) == true)
        computerMove();
}
function computerMove(){
    var root = new State();
    root.board = [].concat(rawBoard);
    root.nextColor = engine.nextPieceColor;
    var r = alphaBetaSearch(root);
    if(r.action != null)
        console.log("in main: "+ r.action.row+":"+r.action.column +",");
    console.log("in main: " + r.terminated +"," + r.value);
    if(r.action == null) 
        console.log("Error:"+r);
    else drawMove(r.action);

    if(r.terminated == true){
        if(r.value == 2*MAX_VALUE) alert("You lose");
        else if(r.value == 3*MIN_VALUE) alert("draw");
        else if(r.value == 2*MIN_VALUE) alert("You win");
        finalizeGame();
        
    }

    
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
