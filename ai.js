// AI for the game with Alpha beta prunning algorithm and cutoff techniques
//state: board, difficulty, turn 
// turn: black or red which the computer uses
maxPruning = 0;
minPruning = 0;
nodes = 0;
ply = 0;
function alphaBetaSearch(state){
    // IDS to save space
    ply += 1;
    var depth = 0;
    for(depth = setting.diff - 1; depth > 0; -- depth){
        maxPruning = minPruning = nodes = 0;
        var r = maxValue(state, 
                         new abState(new Cell(0,0), false, MIN_VALUE), 
                         new abState(new Cell(0,0), false, MAX_VALUE),
                         null, depth);        
        if(r.terminated == true) break;
    }
    printStat(r.value, ply, nodes, maxPruning, minPruning, setting.diff - depth);
    return r;
}

function maxValue(state, a, b, action, depth){
    var s = eval(state);
    //console.log(s);
    if(s[0] == true || depth++ >= setting.diff) 
        return new abState(action, s[0], s[1]);

    // v contains the min value and the action
    var v = new abState(action, false, MIN_VALUE);

    var resActions = getActions(state);
    for(var i in resActions){
        v = max(v, minValue(result(state, resActions[i]), 
                            a, b,resActions[i], depth));
        if(v.value >= b.value) {
            ++maxPruning;
            return v;
        }
        a = max(a, v);
    }
    return v;
}

function minValue(state, a, b, action, depth){
    var s = eval(state);
    //console.log(s);
    if(s[0] == true || depth >= setting.diff) 
        return new abState(action, s[0], s[1]);

    var v = new abState(action, false, MAX_VALUE);
    var resActions = getActions(state);
    for(var i in resActions){
        v = min(v, maxValue(result(state, resActions[i]), 
                            a, b, action, depth));
        if(v.value <= a.value){
            ++minPruning;
            return v;
        }
        b = min(b, v);
    }
    return v;
}

function getActions(state){
    var act = new Array(new Cell(1,0), new Cell(1,1),
                        new Cell(1,2), new Cell(1,3),
                        new Cell(5,0), new Cell(5,1),
                        new Cell(5,2), new Cell(5,3));
    var result = new Array();
    for(var i = 0; i < act.length; ++i){
        if(act[i].row  == 1){
            if(state.board[act[i].row][act[i].column] 
               == pieceStatus.EMPTY)
                result.push(act[i]);
        }
        else{
            if(state.board[act[i].row][act[i].column] 
               == state.nextColor)
                result.push(act[i]);
        }
    }
    return result;
}

function result(state, action){
    var tmp_engine = new gameEngine(state.nextColor);
    var tmp_board = copyBoard(state.board);
    tmp_engine.getNextAction(action, tmp_board);
    // console.log("_______________________");
    // console.log("action:" + action.row + "," + action.column);
    // console.log(tmp_board[1]);
    // console.log(tmp_board[2]);
    // console.log(tmp_board[3]);
    // console.log(tmp_board[4]);
    // console.log(tmp_board[5]);

    var newState = new State();
    newState.nextColor = tmp_engine.nextPieceColor;
    newState.board = tmp_board;
    ++nodes;
    return newState;
}

function max(lh, rh){
    if (lh.value > rh.value) return lh;
    return rh;
}
function min(lh, rh){
    if(lh.value < rh.value) return lh;
    return rh;
}

function eval(state){
    // weight for 2 and 3 connected pieces of current players' 
    var w1 = 5, w2 = 12;
    var w3 = -5, w4 = -10; // for the opposite
    var connCnt = new Array(0,0, 0,0, 0,0, 0,0); // 1,2 for w1,w2
    var win = false, lose = false;

    // herizonally check
    for(var row = 5; row > 0; --row){
        var isTurn = false;
        var cnt = 0;
        for(var col = 0; col < 4; ++col){
            if(state.board[row][col] != pieceStatus.EMPTY){
                if(state.board[row][col] == pieceStatus.RED){
                    // eval should always follow the computer's best strategy
                    if(isTurn == true) ++cnt; // the prev color
                    else{
                        isTurn = true;
                        if(cnt == 2) connCnt[2] += 1;
                        else if(cnt == 3){
                            connCnt[3] += 1;
                            // reward the step to stop next step to win
                            connCnt[1] += 2;
                        }
                        else if(cnt == 4){
                            lose = true;
                            //break;
                            // continue to check if it's a draw
                        }
                        cnt = 1;
                    }                   
                }
                else{
                    if(isTurn == false) ++cnt;
                    else{
                        isTurn = false;
                        if(cnt == 2) connCnt[0] += 1;
                        else if(cnt == 3) connCnt[1] += 1; 
                        else if(cnt == 4) {
                            win = true;
                            //break;
                        }
                        cnt = 1;
                    }
                }
            }
            else{
                if(cnt > 1){
                    if(isTurn == true){
                        if(cnt == 2) connCnt[0] += 1;
                        else if(cnt == 3) connCnt[1] += 1;
                        else if(cnt == 4)  win = true;
                    }
                    else if(isTurn == false){
                        if(cnt == 2) connCnt[2] += 1;
                        // should not leave a 3-connected to the next ply
                        else if(cnt == 3) connCnt[3] += 3;
                        else if(cnt == 4) lose = true;
                    }
                }
                isTurn = false;
                cnt = 0;
            }
        }
        if(cnt > 1){
            if(isTurn == true){
                if(cnt == 2) connCnt[0] += 1;
                else if(cnt == 3) connCnt[1] += 1;
                else if(cnt == 4)  win = true;
            }
            else if(isTurn == false){
                if(cnt == 2) connCnt[2] += 1;
                else if(cnt == 3) connCnt[3] += 1;
                else if(cnt == 4) lose = true;
            }
        }

        if( win && lose ) break;
    } // herizonal check ends

//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    else if( win ) return new Array(true, 2*MAX_VALUE);
    else if( lose ) return new Array(true, 2*MIN_VALUE);
    
    // vertical check
    for(var col = 0; col < 4; ++col){
        var isTurn = false;
        var cnt = 0;
        for(var row = 5; row > 0; --row){
            if(state.board[row][col] != pieceStatus.EMPTY){
                if(state.board[row][col] == pieceStatus.RED){
                    if(isTurn == true) ++cnt;
                    else{
                        isTurn = true;
                        if(cnt == 2) connCnt[2] += 1;
                        else if(cnt == 3) {
                            connCnt[3] += 1;
                            connCnt[1] += 2;
                        }
                        else if(cnt == 4) lose = true;
                        cnt = 1;
                    }
                }
                else{
                    if(isTurn == false) ++cnt;
                     else{
                         isTurn = false;
                         if(cnt == 2) connCnt[0] += 1;
                         else if(cnt == 3) connCnt[1] += 1;
                         else if(cnt == 4) win = true;
                         cnt = 1;
                     }
                }
            }
            else break; // vertically empty means ends
        }
        if(cnt > 1){
            if(isTurn == true){
                if(cnt == 2) connCnt[0] += 1;
                else if(cnt == 3) connCnt[1] += 1;
                else if(cnt == 4)  win = true;
            }
            else if(isTurn == false){
                if(cnt == 2) connCnt[2] += 1;
                else if(cnt == 3) connCnt[3] += 3; //3-connected
                else if(cnt == 4) lose = true;
            }
        }
        if( win && lose ) break;
    }
//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    if( win ) return new Array(true, 2*MAX_VALUE);
    if( lose ) return new Array(true, 2*MIN_VALUE);

    // 45-degree check col0->col3
    for(var col = 0; col < 4; ++col){
        var isRed = false; 
        // check if it's a start or continue of a color piece
        var cnt = 0;
        for(var row = 5, tmpCol = col; 
            row > 0 && tmpCol < 4; --row, ++tmpCol){
            if(state.board[row][tmpCol] != pieceStatus.EMPTY){
                if(state.board[row][tmpCol] == pieceStatus.RED){
                    if(isRed == true) ++cnt;
                    else{
                        isRed = true;
                        // previous black pieces counter
                        if(cnt == 2) connCnt[6] += 1;
                        else if(cnt == 3) {
                            connCnt[7] += 1;
                            connCnt[5] += 2;
                        }
                        else if(cnt == 4) lose = true;
                        cnt = 1;
                    }
                }
                else{
                    if(isRed == false) ++cnt;
                     else{
                         isRed = false;
                         if(cnt == 2) connCnt[4] += 1;
                         else if(cnt == 3) connCnt[5] += 1;
                         else if(cnt == 4) win = true;
                         cnt = 1;
                     }
                }
            }
            else break; // vertically empty means ends
        }
        if(cnt > 1){
            if(isRed == true){
                if(cnt == 2) connCnt[4] += 1;
                else if(cnt == 3) connCnt[5] += 1;
                else if(cnt == 4)  win = true;
            }
            else if(isRed == false){
                if(cnt == 2) connCnt[6] += 1;
                else if(cnt == 3) connCnt[7] += 3; // 3-connect
                else if(cnt == 4) lose = true;
            }
        }
        if( win && lose ) break;
    }
//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    if( win ) return new Array(true, 2*MAX_VALUE);
    if( lose ) return new Array(true, 2*MIN_VALUE);

    // 45-degree check row4->row1
    for(var row = 4; row > 0; --row){
        var isRed = false; 
        // check if it's a start or continue of a color piece
        var cnt = 0;
        for(var tmpRow = row, col = 0; 
            tmpRow > 0 && col < 4; --tmpRow, ++col){
            if(state.board[tmpRow][col] != pieceStatus.EMPTY){
                if(state.board[tmpRow][col] == pieceStatus.RED){
                    if(isRed == true) ++cnt;
                    else{
                        isRed = true;
                        // previous black pieces counter
                        if(cnt == 2) connCnt[6] += 1;
                        else if(cnt == 3) {
                            connCnt[7] += 1;
                            connCnt[5] += 2;
                        }
                        else if(cnt == 4) lose = true;
                        cnt = 1;
                    }
                }
                else{
                    if(isRed == false) ++cnt;
                     else{
                         isRed = false;
                         if(cnt == 2) connCnt[4] += 1;
                         else if(cnt == 3) connCnt[5] += 1;
                         else if(cnt == 4) win = true;
                         cnt = 1;
                     }
                }
            }
            else break; // vertically empty means ends
        }
        if(cnt > 1){
            if(isRed == true){
                if(cnt == 2) connCnt[4] += 1;
                else if(cnt == 3) connCnt[5] += 1;
                else if(cnt == 4)  win = true;
            }
            else if(isRed == false){
                if(cnt == 2) connCnt[6] += 1;
                else if(cnt == 3) connCnt[7] += 3; // 3-connected alone
                else if(cnt == 4) lose = true;
            }
        }
        if( win && lose ) break;
    }
//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    if( win ) return new Array(true, 2*MAX_VALUE);
    if( lose ) return new Array(true, 2*MIN_VALUE);



    // 135-degree check col0->col3
    for(var col = 0; col < 4; ++col){
        var isRed = false; 
        // check if it's a start or a continue of a color piece
        var cnt = 0;
        for(var row = 1, tmpCol = col; 
            row < 6 && tmpCol < 4; ++row, ++tmpCol){
            if(state.board[row][tmpCol] != pieceStatus.EMPTY){
                if(state.board[row][tmpCol] == pieceStatus.RED){
                    if(isRed == true) ++cnt;
                    else{
                        isRed = true;
                        // previous black pieces counter
                        if(cnt == 2) connCnt[6] += 1;
                        else if(cnt == 3){
                            connCnt[5] += 1;
                            connCnt[7] += 2;
                        }
                        else if(cnt == 4) lose = true;
                        cnt = 1;
                    }
                }
                else{
                    if(isRed == false) ++cnt;
                     else{
                         isRed = false;
                         if(cnt == 2) connCnt[4] += 1;
                         else if(cnt == 3) connCnt[5] += 1;
                         else if(cnt == 4) win = true;
                         cnt = 1;
                     }
                }
            }
            // else break; //upleft -> down right cannot escape
        }
        if(cnt > 1){
            if(isRed == true){
                if(cnt == 2) connCnt[4] += 1;
                else if(cnt == 3){
                    connCnt[5] += 1;
                }
                else if(cnt == 4)  win = true;
            }
            else if(isRed == false){
                if(cnt == 2) connCnt[6] += 1;
                else if(cnt == 3) connCnt[7] += 3; // 3-connected
                else if(cnt == 4) lose = true;
            }
        }
        if( win && lose ) break;
    }
//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    if( win ) return new Array(true, 2*MAX_VALUE);
    if( lose ) return new Array(true, 2*MIN_VALUE);

    // 135-degree check row1->row4
    for(var row = 1; row < 6; ++row){
        var isRed = false; 
        // check if it's a start or continue of a color piece
        var cnt = 0;
        for(var tmpRow = row, col = 0; 
            tmpRow < 6 && col < 4; ++tmpRow, ++col){
            if(state.board[tmpRow][col] != pieceStatus.EMPTY){
                if(state.board[tmpRow][col] == pieceStatus.RED){
                    if(isRed == true) ++cnt;
                    else{
                        isRed = true;
                        // previous black pieces counter
                        if(cnt == 2) connCnt[6] += 1;
                        else if(cnt == 3) {
                            connCnt[5] += 1;
                            connCnt[7] += 1;
                        }
                        else if(cnt == 4) lose = true;
                        cnt = 1;
                    }
                }
                else{
                    if(isRed == false) ++cnt;
                     else{
                         isRed = false;
                         if(cnt == 2) connCnt[4] += 1;
                         else if(cnt == 3) connCnt[5] += 1;
                         else if(cnt == 4) win = true;
                         cnt = 1;
                     }
                }
            }
           // else break; // from up left to down right so cannot escape
        }
        if(cnt > 1){
            if(isRed == true){
                if(cnt == 2) connCnt[4] += 1;
                else if(cnt == 3) connCnt[5] += 1;
                else if(cnt == 4)  win = true;
            }
            else if(isRed == false){
                if(cnt == 2) connCnt[6] += 1;
                else if(cnt == 3) connCnt[7] += 3; // 3-connected
                else if(cnt == 4) lose = true;
            }
        }
        if( win && lose ) break;
    }
//    console.log("connCnt: "+ connCnt);
    if( win && lose ) return new Array(true, 3*MIN_VALUE);
    if( win ) return new Array(true, 2*MAX_VALUE);
    if( lose ) return new Array(true, 2*MIN_VALUE);


    var finalEval = w1*connCnt[0] + w2*connCnt[1] +
        w3*connCnt[2] + w4*connCnt[3]+
        w1*connCnt[4] + w2*connCnt[5]+
        w3*connCnt[6] + w4*connCnt[7];
    // terminated or not, eval or result(win, lose or draw)
    return new Array(false, finalEval) 
   
}
