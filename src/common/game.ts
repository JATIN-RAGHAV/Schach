import { columnSize, rowSize } from "./interfaces/constants";
import { gameOverReasons, type Board, type gameObject, type moveIndex, type Row } from "./interfaces/game";
import { color as colors , pawnEnPassant, Pieces,  piecesColorMap,  purePieces, purePiecesMap, smallestEnPassantPawnBit, specialMoveFlagsEnums, type gameState } from "./interfaces/enums";
import Moves, { type moveDetails } from "./pieceMovement";
import { Zobrist } from "./interfaces/Zobrist";
import { defaultIncrement } from "./constats";

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

// Converts move to index; moves is like sourcetarget eg -> e2e4 ( which means e2 to e4 )
// move is column major, but the index is row major
export const moveCharsToIndex = (move:string) => {
    move.toLowerCase();
    if(move.length == 4){
        const aCode = 'a'.charCodeAt(0);
        const zCode = '1'.charCodeAt(0);
        const sCol = move.charCodeAt(0) - aCode;
        const sRow = move.charCodeAt(1) - zCode;
        const tCol = move.charCodeAt(2) - aCode;
        const tRow = move.charCodeAt(3) - zCode;
        return [sRow,sCol,tRow,tCol];
    }
    else{
        return null;
    }
}

// Converts a index based move back to the move defined by the protocol
// Has to return in Column Major
export const moveIndexToChars = ([sRow,sCol,tRow,tCol]:moveIndex):string => {
    let aCode = 'a'.charCodeAt(0);
    let zCode = '1'.charCodeAt(0);
    let res = String.fromCharCode(sCol+aCode) + String.fromCharCode(sRow+zCode) + String.fromCharCode(tCol+aCode) + String.fromCharCode(tRow+zCode);
    return res;
}

export const isMoveOkWithoutContext = (board:Board,move:moveIndex,color:colors,specialMoveFlags:number) => {
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = move;
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
            // If flags on then then the rook or king has moved
            const ARookFlag = specialMoveFlags & (color == colors.White ? specialMoveFlagsEnums.WAR: specialMoveFlagsEnums.BAR);
            const HRookFlag = specialMoveFlags & (color == colors.White ? specialMoveFlagsEnums.WHR: specialMoveFlagsEnums.BHR);

            const direction = (tCol - sCol)/Math.abs(dx);
            if(direction  > 0 && HRookFlag){
                return false;
            }
            else if(dx < 0 && ARookFlag){
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
            if(sRow in [2,rowSize-3]){
                const flagLocation = pawnEnPassant.get([(sRow == 2 ? sRow-1 : sRow+1),tCol]) as specialMoveFlagsEnums;
                const isFlagOn = specialMoveFlags & (1 << flagLocation);
                if(isFlagOn){
                    possible = true;
                }
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
    for(let row=0;row<rowSize;row++){
        for(let col=0;col<columnSize;col++){
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

    const [row,col] = findPieceCordinates(board,piece) as [number,number];

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

    // Check for diagonally moving pieces
    for(let dRow of [-1,1]){
        let cRow = row;
        let cCol = col;
        for(let dCol of [-1,1]){
            cRow += dRow;
            cCol += dCol;
            if(locationInBoard(cRow,cCol)){
                const tarPiece = (board[cRow] as Row)[cCol] as Pieces;
                const oppoColor = piecesColorMap.get(tarPiece) == (color == colors.White ? colors.Black : colors.White);
                const isQueen = purePiecesMap.get(tarPiece) == purePieces.Q;
                const isBishop = purePiecesMap.get(tarPiece) == purePieces.B;
                const notEmpty = tarPiece != Pieces.NN;
                if(oppoColor && (isQueen || isBishop)){
                    return true;
                }
                else if(notEmpty){
                    break;
                }
            }
        }
    }

    // Check for straight moving pieces
    for(let dRow of [-1,1,0]){
        let cRow = row;
        let cCol = col;
        for(let dCol of (cRow == 0 ? [-1,1] : [0])){
            cRow += dRow;
            cCol += dCol;
            if(locationInBoard(cRow,cCol)){
                const tarPiece = (board[cRow] as Row)[cCol] as Pieces;
                const oppoColor = piecesColorMap.get(tarPiece) == (color == colors.White ? colors.Black : colors.White);
                const isQueen = purePiecesMap.get(tarPiece) == purePieces.Q;
                const isRook = purePiecesMap.get(tarPiece) == purePieces.R;
                const notEmpty = tarPiece != Pieces.NN;
                if(oppoColor && (isQueen || isRook)){
                    return true;
                }
                if(notEmpty){
                    break;
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
export const arePieceInMiddle = (board:Board,move:moveIndex,color:colors) => {
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = move;
    const targetRow = board[tRow] as Row;
    const targetSquare = targetRow[tCol] as Pieces;

    // Knight always works
    const dx = tCol - sCol;
    const dy = tRow - sRow;
    // Check for pieces in the middle
    const rowDir = (dy != 0 ? dy/(Math.abs(dy)) : 0 );
    const colDir = (dx != 0 ? dx/(Math.abs(dx)) : 0 );
    for(let cRow=sRow+rowDir,cCol=sCol+colDir; cRow!=tRow && cCol!=tCol ; cRow+=rowDir,cCol+=colDir){
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

    // Make the move
    targetRow[tCol] = sourceSquare;
    sourceRow[sCol] = Pieces.NN;
    // Check for castle
    const isKing = purePiecesMap.get(sourceSquare) == purePieces.K;
    const isMoving2Squares = Math.abs(tCol - sCol) == 2;
    if(isKing && isMoving2Squares){
        const direction = (tCol - sCol)/Math.abs(tCol - sCol);
        sourceRow[sCol + direction] = sourceRow[7];
        sourceRow[(direction > 0 ? 7 : 0)] = Pieces.NN;
    }
}

// Update the game object 
export const updateGameObject = (gameObject:gameObject,moveTime:number,move:string,color:colors,increment:number) =>{
    let {board,movesTimes,startTime} = gameObject;

    // Update time
    const lastTime = movesTimes.at(-1) as number;
    const timeSinceGameStart = moveTime - startTime;
    const timeTakeForCurrentMove = timeSinceGameStart - lastTime;
    movesTimes.push(timeSinceGameStart);
    if(color == colors.White){
        gameObject.whiteTimeLeft = Math.max(0,gameObject.whiteTimeLeft - timeTakeForCurrentMove);
        gameObject.whiteTimeLeft += increment + defaultIncrement;
    }
    else{
        gameObject.blackTimeLeft = Math.max(0,gameObject.blackTimeLeft - timeTakeForCurrentMove);
        gameObject.blackTimeLeft += increment + defaultIncrement;
    }

    // Update moves
    gameObject.moveNumber++;
    gameObject.moves.push(move);
    makeMove(board,move);

    // Update current Zobrist hash and also the count
    // Zobrist function wants the old special Flags and the new ones also
    const newFlag = updateFlags(board,gameObject.specialMoveFlags,moveCharsToIndex(move) as moveIndex,color);
    const newHash = Zobrist.getNextHash(gameObject.currentZobristhash,moveCharsToIndex(move) as moveIndex,board,color,gameObject.specialMoveFlags,newFlag);
    gameObject.currentZobristhash = newHash;
    gameObject.zobristHash.set(newHash,(gameObject.zobristHash.get(newHash) ?? 0) + 1);
    
    // Update the flags
    gameObject.specialMoveFlags = newFlag;
}


// Returns true if move is valid and false otherwise
export const isMoveOk = (board:Board,move:string,color:colors,specialMoveFlags:number):boolean=>{
    // Get the details about the move
    const [sRow,sCol,tRow,tCol] = moveCharsToIndex(move) as moveIndex;
    const sourceRow = board[sRow] as Row;
    const targetRow = board[tRow] as Row;
    let sourceSquare = sourceRow[sCol] as Pieces;
    let targetSquare = targetRow[tCol] as Pieces;
    const purePiece = purePiecesMap.get(sourceSquare);

    // Check whether the move makes sense on it's own
    if(!isMoveOkWithoutContext(board,[sRow,sCol,tRow,tCol],color,specialMoveFlags)){
        return false;
    }

    // Check whether there are pieces in the middle or not and only check if the moved piece is not a knight
    if(purePiece != purePieces.N && arePieceInMiddle(board,[sRow,sCol,tRow,tCol],color)){
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
        return false;
    }
    // Fix move
    targetRow[tCol] = targetSquare;
    sourceRow[sCol] = sourceSquare;

    // Check while castling if king goes through a check
    // Check if the move is castle
    const isKing = purePiece == purePieces.K;
    const isMovingTwoSquares = Math.abs(tCol- sCol)== 2;
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
            return false;
        }
        // Fix the king
        targetRow[cCol] = Pieces.NN;
        sourceRow[sCol] = sourceSquare;
    }

    // If all is well then return then return true;
    return true;
}

// Returns a list of all the possible moves for the pieces of the given color
export const generatePossibleMoves = (board:Board,color:colors,specialMoveFlags:number) => {
    // Initialise a list of possible moves
    let possibleMoves:moveIndex[] = [];
    // Go through all the square and find the ones that are of the given color
    for(let sRow=0;sRow<rowSize;sRow++){
        for(let sCol=0;sCol<columnSize;sCol++){
            // Get the details about the square
            const sourceRow = board[sRow] as Row;
            const sourceSquare = sourceRow[sCol] as Pieces;
            if(piecesColorMap.get(sourceSquare) == color){

                // Check for pawn separately, it's got some moves
                if(purePiecesMap.get(sourceSquare) == purePieces.P){
                    const direction = (color == colors.White ? 1 : -1);
                    const initialRow = color == colors.White ? 1 : rowSize-2;

                    // straight movement of the pawn
                    for(let dRow = 1;dRow<=(sRow==initialRow ? 2 : 1);dRow++){
                        const tRow = sRow + (dRow*direction);
                        const targetRow = board[tRow] as Row;
                        const targetSquare = targetRow[sCol] as Pieces;
                        if(targetSquare == Pieces.NN){
                            const moveString = moveIndexToChars([sRow,sCol,tRow,sCol]);
                            const isMoveLegal = isMoveOk(board,moveString,color,specialMoveFlags);
                            // If move ok then add to the possible moves
                            if(isMoveLegal){
                                const move = [sRow,sCol,tRow,sCol] as moveIndex;
                                possibleMoves.push(move);
                            }
                        }
                    }

                    // Capture by pawn and en-passant
                    const tRow = sRow + direction;
                    for( let dCol of [-1,1]){
                        const tCol = sCol + (direction*dCol);
                        if(locationInBoard(tRow,tCol)){
                            let targetRow = board[tRow] as Row;
                            let targetSquare = targetRow[tCol] as Pieces;
                            if(piecesColorMap.get(targetSquare) == (color == colors.White ? colors.Black : colors.White)){
                                const move = [sRow,sCol,tRow,tCol] as moveIndex;
                                possibleMoves.push(move);
                            }
                        }
                    }
                }

                // Check for other pieces
                else{
                    // Get the direction that this piece can move in
                    // Every piece other than a pawn has a direction defined
                    const moveDetails = Moves.get(purePiecesMap.get(sourceSquare) as purePieces) as moveDetails;
                    for(let move of moveDetails.moves){
                        const [dRow, dCol] = move;
                        let cRow = sRow + dRow;
                        let cCol = sCol + dCol;
                        // Go through the depth
                        for(let d = 0;d<moveDetails.depth;d++){
                            if(locationInBoard(cRow,cCol)){
                                const currentRow = board[cRow] as Row;
                                const currentSquare = currentRow[cCol] as Pieces;
                                const moveString = moveIndexToChars([sRow,sCol,cRow,cCol]);
                                const isColorSame = piecesColorMap.get(currentSquare) == color;
                                const isMoveLegal = isMoveOk(board,moveString,color,specialMoveFlags);
                                if(!isColorSame && isMoveLegal){
                                    possibleMoves.push([sRow,sCol,cRow,cCol]);
                                }
                                else{
                                    // If move not ok then moving in the same direction doesn't make sense
                                    break;
                                }
                            }
                            else{
                                // If the move is out of the board then break the loop
                                break;
                            }
                        }
                    }
                }
            } 
        }
    }
    return possibleMoves
}

// Return true if there is a checkmate, the king of the given color is in checkmate
export const isCheckMate = (board:Board,color:colors,specialMoveFlags:number) => {
    // Get all the possible moves
    const possibleMoves = generatePossibleMoves(board,color,specialMoveFlags);
    const isKingUnderCheck = isKingInCheck(board,color);
    if(isKingUnderCheck && possibleMoves.length == 0){
        return true;
    }
    return false;
}

// Return true if there is a stalemate, the pieces of the given color can't move
export const isStateMate = (board:Board,color:colors,specialMoveFlags:number) => {
    // Get all the possible moves
    const possibleMoves = generatePossibleMoves(board,color,specialMoveFlags);
    const isKingUnderCheck = isKingInCheck(board,color);
    if(!isKingUnderCheck && possibleMoves.length == 0){
        return true;
    }
    return false;
}

// Returns true if the current board has appeared 3 times in total
export const isThreeFoldRepetition = (gameObject:gameObject):boolean => {
    let res = false;
    if(gameObject.zobristHash.get(gameObject.currentZobristhash) == 3){
        res = true;
    }
    return res;
}

// Returns true if board has at max a bishop or knight for the given color ( king not included )
const isInsufficientForColor = (board:Board, color:colors) => {
    // Increase count only for bishop, knight or king
    let count = 0;
    for(let  i = 0;i<rowSize;i++){
        for(let j = 0;j<columnSize;j++){
            const row = board[i] as Row;
            const piece = row[j] as Pieces;
            if(piecesColorMap.get(piece) == color){
                const purePiece = purePiecesMap.get(piece) as purePieces;
                if(purePiece == purePieces.B || purePiece == purePieces.N || purePiece == purePieces.K){
                    count++;
                }
            }
        }
    }
    return (count <= 2);
}

// Check for Insufficient Material
const isInsufficientMaterial = (board:Board) => {
    if(isInsufficientForColor(board,colors.White) && isInsufficientForColor(board,colors.Black)){
        return true;
    }
    return false;
}

// Checks if the game is ended, takes the color of the player who made the last move
// The winner makes the last move, return Yes, No or Draw
// Only checks for checkmate and stalemate and move repetition
export const isGameEnded = (gameObject:gameObject,color:colors):gameState => {
    const {board,specialMoveFlags,whiteTimeLeft,blackTimeLeft} = gameObject;
    let resGameState:gameState = {
        over:false,
        gameEndReason:gameOverReasons.notOver
    }
    const possibleMoves = generatePossibleMoves(board,color,specialMoveFlags);
    const isKingUnderCheck = isKingInCheck(board,color);

    if(possibleMoves.length == 0){
        // Check for checkmate for the opponent
        if(isKingUnderCheck){
            resGameState.over = true;
            resGameState.gameEndReason = gameOverReasons.checkmate;
        }
        // Check for stalemate for the opponent
        else{
            resGameState.over = true;
            resGameState.gameEndReason = gameOverReasons.stalemate;
        }
    }

    // Check for move repetition
    if(isThreeFoldRepetition(gameObject)){
        resGameState.over = true;
        resGameState.gameEndReason = gameOverReasons.threefoldRepetition;
    }

    // Check for time
    if(color == colors.White ? whiteTimeLeft <= 0 : blackTimeLeft <= 0){
        resGameState.over = true;
        resGameState.gameEndReason = gameOverReasons.timeover;
    }

    // Check for Insufficient Material
    if(isInsufficientMaterial(board)){
        resGameState.over = true;
        resGameState.gameEndReason = gameOverReasons.insufficientMaterial;
    }

    return resGameState;
}

// return the updated flags
export const updateFlags = (board:Board,specialMoveFlags:specialMoveFlagsEnums,move:moveIndex,color:colors) => {
    // Update special flags
    // Get the details about the move
    const [sRow,sCol,tRow] = move;
    const sourceRow = board[sRow] as Row;
    let sourceSquare = sourceRow[sCol] as Pieces;

    // Turn off all the en passant flags
    specialMoveFlags &= smallestEnPassantPawnBit-1;

    let noPawnMove = true;
    // Check for King moves
    // If the flag is one then the piece has moved and can't castle
    if(purePieces.K == purePiecesMap.get(sourceSquare)){
        if(color == colors.White){
            specialMoveFlags |= specialMoveFlagsEnums.WAR | specialMoveFlagsEnums.WHR; 
        }
        else{
            specialMoveFlags |= specialMoveFlagsEnums.BAR | specialMoveFlagsEnums.BHR; 
        }
    }
    // Check for rook moves
    else if(purePieces.R == purePiecesMap.get(sourceSquare)){
        // Check if the rook moved from initial position
        if(sCol == 0){
            specialMoveFlags |= (color == colors.White ? specialMoveFlagsEnums.WAR : specialMoveFlagsEnums.BAR);
        }
        else if(sCol == columnSize-1){
            specialMoveFlags |= (color == colors.White ? specialMoveFlagsEnums.WHR : specialMoveFlagsEnums.BHR);
        }
    }
    // Check for pawn Movements, If pawn moved by 2 squares then update that flag to be on
    else if(purePieces.P == purePiecesMap.get(sourceSquare)){
        if(Math.abs(tRow - sCol) == 2){
            noPawnMove = false;
            specialMoveFlags |= pawnEnPassant.get([sRow,sCol]) as number;
        }
    }
    if(noPawnMove){
        specialMoveFlags &= ~(pawnEnPassant.get([sRow,sCol]) as number);
    }
    return specialMoveFlags;
}

export const getInitialGameObject = (time:number):gameObject => {
    // Get Intial board
    const board = initBoard();
    const startTime = Date.now();

    return{
        board,
        startTime,
        moves:new Array<string>(),
        moveNumber:0,
        movesTimes:[0],
        whiteTimeLeft:time,
        zobristHash:new Map<bigint,number>(),
        currentZobristhash:Zobrist.getInitialBoardHash(),
        specialMoveFlags:0,
        blackTimeLeft:time,
    }
}
