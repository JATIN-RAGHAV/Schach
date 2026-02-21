import { generatePossibleMoves, initBoard, moveIndexToChars } from "../game";
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
