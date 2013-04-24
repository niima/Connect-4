canvas.addEventListener("click", canvasOnClick, false);
drawBoard();
initBoard();
engine = new gameEngine(pieceStatus.BLACK);

function drawBoard(){
    // var my_gradient=ctx.createLinearGradient(0,0,0,500);
    // my_gradient.addColorStop(0,"white");
    // my_gradient.addColorStop(1,"green");
    // ctx.fillStyle=my_gradient;
    // ctx.fillRect(0, 0, canvas.width, canvas.height); 

    ctx.font = "20px serif";
    ctx.strokeText("Score: 40",0, 20);
    ctx.strokeText("Ply: 4", 0, 40);
    //ctx.clearRect(0,0,100,100);
    ctx.strokeText("Diff", 100, 20);
    ctx.beginPath();
    // 3 boxes to show the difficulty
    ctx.fillStyle = "#66FF66";
    ctx.fillRect(140, 4, 40, 20);
    ctx.fillStyle = "#0066FF";
    ctx.fillRect(190, 4, 40, 20);
    ctx.fillStyle = "#FF3300";
    ctx.fillRect(240, 4, 40, 20);

    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(300, 4, 50, 20);
    ctx.strokeText("Start", 300, 20);

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
    ctx.fill();
    ctx.stroke();
}

function initBoard(){
    for(var i = 0; i < 6; ++i){
        board[i] = new Array();
        for(var j = 0; j < 4; ++j){
            board[i].push(pieceStatus.EMPTY);
        }
    }
}

function canvasOnClick(e){
    var cell = getCursorPosition(e);
    
//    alert(cell.row+" "+cell.column);
    //res: [[row,col,color],]
    var res = engine.getNextAction(cell, board);
    var arr = res.pop();
    while(arr!= null){
        //alert(arr);
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

    // for(var i = 0; i < res.length; ++i){
    //     alert(i+"/"+res.lenth+" " +res[i][2]);
    //     ctx.beginPath();
    //     ctx.arc(res[i][1]*100 + 50, 
    //             res[i][0]*100 + 50, pieceRadix, 
    //             0, 2*Math.PI, false);
    //     if(res[i][2] == pieceStatus.BLACK){
    //         ctx.strokeStyle = "#0A0000";
    //         ctx.fillStyle = "#0A0000";
    //         ctx.fill();
    //         ctx.stroke();
    //     }
    //     else if(res[i][2] == pieceStatus.RED){
    //         ctx.strokeStyle = "#FF3030";
    //         ctx.fillStyle = "#FF3030";
    //         ctx.fill();
    //         ctx.stroke();
    //     }
    //     else{
    //         ctx.clearRect(res[i][1]*100,
    //                       res[i][0]*100,
    //                       pieceSize,
    //                       pieceSize);
    //     }

    // }

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
