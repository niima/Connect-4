// Implement the logic of the game
function gameEngine(pieceColor){
    this._init(pieceColor);
}

gameEngine.prototype = {
    nextPieceColor: pieceStatus.EMPTY,
    _init: function(pieceColor){
        this.nextPieceColor = pieceColor;
    },
    getNextAction: function(cell, board){
        //return [[row, col, color],]
        // leave the first line empty
        if(cell.row == 0) return [];
        // save the pieces to change
        var r = new Array();
        if(cell.row < 5){
            // find the pos, find the user
            var pos = 0;
            for(pos = 5; pos >= 1; --pos){
                if(board[pos][cell.column] == pieceStatus.EMPTY)
                    break;
            }
            if(pos == 0) return r; // no space in this column
            r.push([pos, cell.column, this.nextPieceColor]);
            board[pos][cell.column] = this.nextPieceColor;
            this.pieceColorExchage();
            return r;
        } 
        else{
            if(board[cell.row][cell.column]
               == pieceStatus.EMPTY){
                r.push([cell.row, cell.column, this.nextPieceColor]);
                board[cell.row][cell.column] = this.nextPieceColor;
            }
            else{
                if(board[cell.row][cell.column] != this.nextPieceColor)
                    return []; // you cannot popup opposite pieces
                // simulate the popup op
                var pos = 4;
                for(; pos > 0; --pos){
                    if(board[pos][cell.column] == pieceStatus.EMPTY)
                        break;
                    r.push([pos + 1, cell.column,
                            board[pos][cell.column]]);
                    board[pos+1][cell.column] = board[pos][cell.column];
                    //board[pos][cell.column] = pieceStatus.EMPTY;
                }
                board[pos+1][cell.column] = pieceStatus.EMPTY;
                r.push([pos + 1, cell.column, pieceStatus.EMPTY]);
            }
            this.pieceColorExchage();
            return r;
        }
    },
    pieceColorExchage: function(){
        if(this.nextPieceColor == pieceStatus.BLACK)
            this.nextPieceColor = pieceStatus.RED;
        else if(this.nextPieceColor == pieceStatus.RED)
            this.nextPieceColor = pieceStatus.BLACK;
        else console.log("nextPieceColor = empty");
    },
}
