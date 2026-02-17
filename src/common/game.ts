import { columnSize, rowSize } from "./interfaces/constants";
import { type Board } from "./interfaces/game";
import { Pieces } from "./interfaces/enums";

const initBoard = () => {
    let board:Board= Array.from({length:rowSize}, () => {
        return Array.from({length:columnSize},() => Pieces.NN)
    })
}
