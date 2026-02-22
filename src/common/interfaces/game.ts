import z from "zod";
import { rowSize ,columnSize } from "./constants";
import { color, Pieces } from "./enums";

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
    startTime:number, // time since unix epoch
    // Time from the start when the move was played
    movesTimes:number[],
    // 4 flags for the castling rights and 16 for en passant
    specialMoveFlags:number,
    // Zobrist hash
    zobristHash:Map<bigint,number>,
    currentZobristhash:bigint,
    whiteTimeLeft:number,
    blackTimeLeft:number,
}

// Moves is source -> target using chars only
// eg-> from e2 to e4 => "ebed"
export const moveSocketRequest = z.string().length(4).regex(/^[a-hA-H][1-8][a-hA-H][1-8]$/);

export interface moveSocketResponse{
    error:boolean,
    message:string,
    over:boolean,
    // If true then receiver won the game
    winner:boolean,
    moveColor:color,
    move:string,
}

export type moveIndex = [number,number,number,number];
