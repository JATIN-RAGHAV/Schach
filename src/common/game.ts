import { columnSize, rowSize } from "./interfaces/constants";
import { type Board, type moveIndex, type Row } from "./interfaces/game";
import { color as colors , moveToSpecialFlag, Pieces,  piecesColorMap,  purePieces, purePiecesMap, specialFlags, specialMovepiece } from "./interfaces/enums";


// Initialize an empty board
export const initBoard = () => {
        // Get the board
        let board:Board = Array.from({length:rowSize},() => {
                return Array.from({length:columnSize},() => {
                        return Pieces.NN;
                })
        }) as Board;

        // Set pieces
        board[0][0] = Pieces.WR;
        board[0][1] = Pieces.WN;
        board[0][2] = Pieces.WB;
        board[0][3] = Pieces.WQ;
        board[0][4] = Pieces.WK;
        board[0][5] = Pieces.WB;
        board[0][6] = Pieces.WN;
        board[0][7] = Pieces.WR;

        board[7][0] = Pieces.BR;
        board[7][1] = Pieces.BN;
        board[7][2] = Pieces.BB;
        board[7][3] = Pieces.BQ;
        board[7][4] = Pieces.BK;
        board[7][5] = Pieces.BB;
        board[7][6] = Pieces.BN;
        board[7][7] = Pieces.BR;

        board[1].fill(Pieces.WP);
        board[6].fill(Pieces.BP);

        return board;
}

export const isPawnFirstMove2 = (board:Board,move:string,color:colors,col:number ) => {
    // Get the move indecies and the source and target squares
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const targetRow = board[tRow] as Row;
    const targetSquare = targetRow[tCol] as Pieces;
    const piece = purePiecesMap.get(targetSquare) as purePieces;
    
    // The piece must have the right color
    if(piecesColorMap.get(targetSquare) != color){
        return false;
    }
    
    // The piece must be a pawn
    if(piece != purePieces.P){
        return false;
    }

    if(color == colors.White){
        // White pawn starts at row number 1
        if(sRow != 1){
            return false;
        }
        // No horizontal movement
        if(sCol != tCol){
            return false;
        }
        // Piece must move by 2 step in the positive direction
        if((tRow - sRow) != 2){
            return false;
        }
    }
    else if(color == colors.Black){
        // Black pawn starts at row number rowSize-2
        if(sRow != rowSize-2){
            return false;
        }
        // No horizontal movement
        if(sCol != tCol){
            return false;
        }
        // Piece must move by 2 step in the negative direction
        if((tRow - sRow) != -2){
            return false;
        }
    }
    
    // Verify the cols
    if(sCol != col){
        return false;
    }
    // If everything checks out then we good
    return true;
}

export const printBoard = (board:Board) => {
    for(let i = rowSize-1 ;i>=0; i--){
        for(let j = 0; j<columnSize; j++){
            const row = board[i];
            if(row != undefined){
                const piece = row[j];
                Bun.write(Bun.stdout,Pieces[piece!=undefined?piece:0]+' ');
            }
        }
            Bun.write(Bun.stdout,'\n')
    }
}

export const moveCharsToIndex = (move:string) => {
    if(move.length == 4){
        const aCode = 'a'.charCodeAt(0);
        const first = move.charCodeAt(0) - aCode;
        const second = move.charCodeAt(1) - aCode;
        const third = move.charCodeAt(2) - aCode;
        const fourth = move.charCodeAt(3) - aCode;
        return [first,second,third,fourth];
    }
    else{
        return null;
    }
}

export const moveIndexToChars = (move:moveIndex) => {
    let res = "";
    let aCode = 'a'.charCodeAt(0);
    for(let x of move){
        res += String.fromCharCode(aCode + x);
    }
    return res;
}

export const isMoveOkWithoutContext = (board:Board,move:string,color:colors,specialMoveFlags:number,lastMove:string) => {
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const targetRow = board[tRow] as Row;
    const sourceSquare = sourceRow[sCol] as Pieces;
    const targetSquare = targetRow[tCol] as Pieces;
    const piece = purePiecesMap.get(sourceSquare) as purePieces;

    // is source square empty ?
    if(sourceSquare == Pieces.NN){
        return false;
    }
    // Is piece's color the right color?
    if(piecesColorMap.get(sourceSquare) != color){
        return false;
    }
    
    // Target can't have the same color as the sourceSquare
    if(piecesColorMap.get(targetSquare) == color){
        return false;
    }

    // Source and Target squares must be different
    if(sRow == tRow && sCol == tCol){
        return false;
    }

    // Make sure that the piece can move like that
    // Check for a knight
    if(piece == purePieces.N){
        let possible = false;
        for(let x of [1,2]){
            let y = 3-x;
            for(let dx of [-1,1]){
                for(let dy of [-1,1]){
                    if(sRow+(dx*x) == tRow && sCol+(dy*y) == tCol){
                        possible = true;
                    }
                }
            }
        }
        if(!possible){
            return false;
        }
    }

    // Check for Rook
    if(piece == purePieces.R){
        if(sRow != tRow && sCol != tCol){
            return false;
        }
    }

    // Check for a Bishop
    if(piece == purePieces.B){
        let dy = Math.abs(sRow - tRow)
        let dx = Math.abs(sCol - tCol)
        if(dx != dy){
            return false;
        }
    }

    // Check for a Queen
    if(piece == purePieces.Q){
        let straight = false;
        let diagonal = false;
        
        // Check for straight move
        if(sRow == tRow || sCol == tCol){
            straight = true;
        }

        // Check for diagonal move
        let dy = Math.abs(sRow - tRow)
        let dx = Math.abs(sCol - tCol)
        if(dx == dy){
            diagonal = true;
        }

        if(!straight && !diagonal){
            return false;
        }
    }

    // Check for King
    if(piece == purePieces.K){
        let dy = Math.abs(sRow - tRow)
        let dx = Math.abs(sCol - tCol)

        // In Castling king moves two steps towards the rook
        if(dx == 2){
            // Vertical movement must be zero
            if(dy != 0){
                return false;
            }

            // Get flags for the rook and the kings and ensure that they have not moved
            const rookFlag = moveToSpecialFlag.get({
                color,
                piece:(tCol-sCol<0? specialMovepiece.ARook : specialMovepiece.HRook)
            }) as specialFlags;
            const kingFlag = moveToSpecialFlag.get({
                color,
                piece:specialMovepiece.King
            }) as specialFlags;

            if((rookFlag & specialMoveFlags) || (kingFlag & specialMoveFlags)){
                return false;
            }
        }
        else{
            if(dx != 1 || dy != 1){
                return false;
            }
        }
    }

    // Check for a Pawn
    if(piece == purePieces.P){
        let possible = false;

        const dx = tCol - sCol;
        const dy = tRow - sRow;
        // Check for basic forward movement
        if(dx == 0){
            let dist = tRow - sRow
            const magnitude = Math.abs(dist);
            // Check the magnitude
            if(magnitude == 1){
                if(color == colors.White && dist>0 && targetSquare == Pieces.NN){
                    possible = true;
                }
                else if(color == colors.Black && dist<0 && targetSquare == Pieces.NN){
                    possible = true;
                }
            }
            else if(magnitude == 2){
                if(color == colors.White && dist>0 && targetSquare == Pieces.NN && sRow == 1){
                    possible = true;
                }
                else if(color == colors.Black && dist<0 && targetSquare == Pieces.NN && sRow == rowSize-2){
                    possible = true;
                }
            }

        }

        // Check for capture and en passant
        if(Math.abs(dx) == 1 && Math.abs(dy) == 1){
            // Check for Capture
            if(color == colors.White && dy == 1 && piecesColorMap.get(targetSquare)==colors.Black ){
                possible = true;
            }
            else if(color == colors.Black && dy == -1 && piecesColorMap.get(targetSquare)==colors.White){
                possible = true;
            }

            // Check for En passant
            if(color == colors.White && dy == 1 && sRow == 4 && isPawnFirstMove2(board,lastMove, colors.Black,tCol)){
                possible = true;
            }
            else if(color == colors.Black && dy == -1 && sRow == 3 && isPawnFirstMove2(board,lastMove, colors.White,tCol)){
                possible = true;
            }
        }

        if(!possible){
            return false;
        }
    }
    
    // If everything ok return true
    return true;
}

export const findPieceCordinates = (board:Board, piece:Pieces) => {
    let row=0;
    let col=0;
    for(;row<rowSize;row++){
        for(;col<columnSize;col++){
            const cPiece = (board[row] as Row)[col] as Pieces;
            if(cPiece == piece){
                return [row,col];
            }
        }
    }
    return null;
}

export const locationInBoard = (row:number, col:number) => {
    return ((row < rowSize && row >= 0 ) && (col < columnSize && col >= 0));
}

// Returns true if the king of the given color is in check
export const isKingInCheck = (board:Board, color:colors) => {
    const piece = color==colors.White ? Pieces.WK : Pieces.BK;
    // Find location of the king, treat this as never null since king will always be there
    const [row,col]= findPieceCordinates(board,piece) as [number,number];

    // Check for pawns separately
    let pawnRow = row+1; // If the checking for White King
    if(color == colors.Black){
        pawnRow = row-1;
    }
    // Check for the top left and right pawn
    for(let pawnCol of [col-1,col+1]){
        if(locationInBoard(pawnRow, pawnCol)){
            const tarPiece = (board[pawnRow] as Row)[pawnCol] as Pieces;
            if(tarPiece == (color == colors.White ? Pieces.BP : Pieces.WP)){
                return true;
            }
        }
    }

    // Check for knight seperately
    for(let dRow of [1,2]){
        const dCol = 3 - dRow; // Since sum of squares travelled in x and y is 3 for knight
        for(let dirRow of [-1,1]){
            for(let dirCol of [-1,1]){
                const nRow = row + (dRow*dirRow);
                const nCol = col + (dCol*dirCol);
                if(locationInBoard(nRow, nCol)){
                    const tarPiece = (board[nRow] as Row)[nCol] as Pieces;
                    if(tarPiece == (color == colors.White ? Pieces.BN : Pieces.WN)){
                    }
                }
            }
        }
    }

    // Check for the rest of the pieces
    for(let dRow of [-1,0,1]){
        let cRow = row;
        let cCol = col;
        for(let dCol of [-1,0,1]){
            cRow += dRow;
            cCol += dCol;
            while(locationInBoard(cRow,cCol)){
                const tarPiece = (board[cRow] as Row)[cCol] as Pieces;
                const sameColor = piecesColorMap.get(tarPiece) == (color == colors.White ? colors.Black : colors.White);
                const isPawn = purePiecesMap.get(tarPiece) == purePieces.P;
                const isKnight = purePiecesMap.get(tarPiece) == purePieces.N;
                if(sameColor && !isPawn && !isKnight){
                    return true;
                }
            }
        }
    }
    return false;
}

// This function get the pure piece and also the piece with color given the board and the move
export const getPieceFromBoard = (board:Board, move:string) => {
    // Get the details about the move
    const [sRow,sCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const sourceSquare = sourceRow[sCol] as Pieces;
    const piece = purePiecesMap.get(sourceSquare) as purePieces;
    return{
        piece:sourceSquare,
        purePiece:piece
    };
}

// This function supposes that the move makes sense on it's own
export const arePieceInMiddle = (board:Board,move:string,color:colors,specialMoveFlags:number,lastMove:string) => {
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const targetRow = board[tRow] as Row;
    const sourceSquare = sourceRow[sCol] as Pieces;
    const targetSquare = targetRow[tCol] as Pieces;
    const piece = purePiecesMap.get(sourceSquare) as purePieces;

    // Knight always works
    const dx = tCol - sCol;
    const dy = tRow - sRow;
    // Check for pieces in the middle
    const rowDir = dy/(Math.abs(dy));
    const colDir = dx/(Math.abs(dx));
    for(let cRow=sRow,cCol=sCol ; cRow!=tRow && cCol!=tCol ; cRow+=rowDir,cCol+=colDir){
        const cRowFull = board[cRow] as Row;
        const cPiece = cRowFull[cCol] as Pieces;
        if(cPiece != Pieces.NN){
            return true;
        }
    }
    // Check the target piece
    if(piecesColorMap.get(targetSquare) == color){
        return true;
    }

    return false;
}

export const copyBoard = (board:Board) => {
    let newBoard:Pieces[][]=[];
    for(let row of board){
        newBoard.push([...row]);
    }
    return newBoard as Board;
}

// Finally make the move in a irreversible way
export const makeMove = (board:Board, move:string) => {
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const targetRow = board[tRow] as Row;
    let sourceSquare = sourceRow[sCol] as Pieces;
    let targetSquare = targetRow[tCol] as Pieces;

    // Make the move
    targetSquare = sourceSquare;
    sourceSquare = Pieces.NN;
}

// Returns true if move is valid and false otherwise
export const isMoveOk = (board:Board,move:string,color:colors,specialMoveFlags:number,lastMove:string):boolean=>{
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const targetRow = board[tRow] as Row;
    let sourceSquare = sourceRow[sCol] as Pieces;
    let targetSquare = targetRow[tCol] as Pieces;
    const purePiece = purePiecesMap.get(sourceSquare);

    // Check whether the move makes sense on it's own
    if(!isMoveOkWithoutContext(board,move,color,specialMoveFlags,lastMove)){
        printBoard(board)
        console.log(`Move is not valid, the piece can't move like that`)
        return false;
    }

    // Check whether there are pieces in the middle or not and only check if the moved piece is not a knight
    if(purePiece != purePieces.N && arePieceInMiddle(board,move,color,specialMoveFlags,lastMove)){
        printBoard(board)
        console.log(`Move is not valid, the piece can move like that, but now with the current board`)
        return false;
    }

    // 1-> if king in check before move
    //     => if making the move fixes the check -> ok
    //     => if making the move doens't fix check -> not ok
    // 2-> if king not in check originalyy
    //     => if making the move puts king in check -> not ok
    //     => if making the move donesn't put king in check -> ok

    // Make the move
    targetRow[tCol] = sourceSquare;
    sourceRow[sCol] = Pieces.NN;
    if(isKingInCheck(board,color)){
        // Fix the move
        targetRow[tCol] = targetSquare;
        sourceRow[sCol] = sourceSquare;
        printBoard(board)
        console.log(`Move is not valid, leads to check.`)
        return false;
    }

    // Check while castling if king goes through a check
    // Check if the move is castle
    const isKing = purePiece == purePieces.K;
    const isMovingTwoSquares = tCol-sCol == 2;
    if(isKing && isMovingTwoSquares){
        const direction = (tCol-sCol)/2;
        // Move the king by one square
        let cCol = sCol+direction;
        sourceRow[sCol] = Pieces.NN;
        sourceRow[cCol] = sourceSquare;
        if(isKingInCheck(board,color)){
            // Fix the move
            sourceRow[sCol] = sourceSquare;
            sourceRow[cCol] = Pieces.NN;
            printBoard(board)
            console.log(`Move is not valid, king passes through check.`)
            return false;
        }
        // Move the king by one more square
        sourceRow[cCol] = Pieces.NN;
        cCol += direction;
        sourceRow[cCol] = sourceSquare;
        if(isKingInCheck(board,color)){
            // Fix the move
            sourceRow[sCol] = sourceSquare;
            sourceRow[cCol] = Pieces.NN;
            printBoard(board)
            console.log(`Move is not valid, king ends up in check.`)
            return false;
        }
    }

    // If all is well then return then return true;
    return true;
}
