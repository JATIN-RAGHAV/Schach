import z from "zod";
import { rowSize ,columnSize } from "./constants";
import { Pieces } from "./enums";

type FixedLengthArray<T, N extends number, R extends T[] = []> =
  R['length'] extends N
    ? R
    : FixedLengthArray<T, N, [...R, T]>;

export type Row = FixedLengthArray<Pieces,typeof rowSize>;
export type Board = FixedLengthArray<Row, typeof columnSize>;

// Time is in miliseconds
export interface gameObject{
    board:Board,
    moveNumber:number,
    moves:string[],
    startTime:Date,
    // Time from the start when the move was played
    movesTimes:number[],
    // If a special piece has moved onece it's flag is 1
    specialMoveFlags:number,
    whiteTimeLeft:number,
    blackTimeLeft:number,
}

// Moves is source -> target using chars only
// eg-> from e2 to e4 => "ebed"
export const moveSent = z.object({
    move:z.string().length(4).regex(/^[a-h]+$/)
});

export type moveIndex = [number,number,number,number];
