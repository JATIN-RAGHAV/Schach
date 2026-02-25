import { getInitialGameObject,printBoard,updateGameObject } from "../game";
import { color } from "../interfaces/enums";
import type { gameObject } from "../interfaces/game";

export const canMoveEnPassant = ()=>{
    let gameObject:gameObject = getInitialGameObject(10 * (60 * 1000));
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
    updateGameObject(gameObject,Date.now(),'e2e4',color.White,0);
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
    updateGameObject(gameObject,Date.now(),'h7h6',color.Black,0);
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
    updateGameObject(gameObject,Date.now(),'e4e5',color.White,0);
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
    updateGameObject(gameObject,Date.now(),'d7d5',color.Black,0);
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
    updateGameObject(gameObject,Date.now(),'e5d6',color.White,0);
    printBoard(gameObject.board);
    console.log(gameObject.specialMoveFlags.toString(2));
};
