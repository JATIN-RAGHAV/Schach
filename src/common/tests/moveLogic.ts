import { generatePossibleMoves, initBoard, isKingInCheck, isMoveOk, makeMove, moveIndexToChars, printBoard } from "../game";
import { color } from "../interfaces/enums";
import type { Board, moveIndex } from "../interfaces/game";

export const isGettingPossibleMoves = () => {
    let board:Board= initBoard();
    let moves = generatePossibleMoves(board,color.White,0);
    console.log("White moves:")
    for(let i in moves){
        const [sRow,sCol,tRow,tCol] = moves[i] as moveIndex;
        Bun.write(Bun.stdout,i+":"+moveIndexToChars([sRow,sCol,tRow,tCol])+' ');
    }
    console.log()
    console.log("Black moves:")
    moves = generatePossibleMoves(board,color.Black,0);
    for(let i in moves){
        const [sRow,sCol,tRow,tCol] = moves[i] as moveIndex;
        Bun.write(Bun.stdout,i+":"+moveIndexToChars([sRow,sCol,tRow,tCol])+' ');
    }
    console.log()
}

// Check whether white can get foot's mated
export const foolProof = () => {
    // Get initial board
    let board:Board= initBoard();
    // Get's into fool's mate position
    // let res = generatePossibleMoves(board,color.White,0);
    // res.forEach(m => console.log(moveIndexToChars(m)))
    makeMove(board,'f2f3');
    printBoard(board)
    // res = generatePossibleMoves(board,color.Black,0);
    // res.forEach(m => console.log(moveIndexToChars(m)))
    makeMove(board,'e7e5');
    printBoard(board)
    // res = generatePossibleMoves(board,color.White,0);
    // res.forEach(m => console.log(moveIndexToChars(m)))
    makeMove(board,'g2g4');
    printBoard(board)
    // res = generatePossibleMoves(board,color.Black,0);
    // res.forEach(m => console.log(moveIndexToChars(m)))
    makeMove(board,'d8h4');
    printBoard(board)
    // res = generatePossibleMoves(board,color.White,0);
    // res.forEach(m => console.log(moveIndexToChars(m)))
    console.log(isKingInCheck(board,color.White))
}
