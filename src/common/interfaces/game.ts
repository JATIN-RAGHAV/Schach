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
    startTime:number, // time when game began, format -> time since unix epoch, miliseconds
    movesTimes:number[],// movesTimes[i] -> time at which move i was played, taking startTime as 0, format-> miliseconds
    specialMoveFlags:number,// 4 flags for the castling rights and 16 for en passant
    // Zobrist hash
    zobristHash:Map<bigint,number>,
    currentZobristhash:bigint,
    whiteTimeLeft:number, // In miliseconds
    blackTimeLeft:number,// In minliseconds
}

// Moves is source -> target using chars only
// eg-> from e2 to e4 => "ebed"
export const moveSocketRequest = z.string().length(4).regex(/^[a-hA-H][1-8][a-hA-H][1-8]$/);

// Reasons why a game could end
export enum gameOverReasons{
    checkmate,
    stalemate,
    threefoldRepetition,
    insufficientMaterial,
    timeover,
    otherResigned,
    otherAbandoned,
    notOver
}

// Interface of what is sent by the server socket to the frontend
export interface moveSocketResponse{
    error:boolean,
    message:string,
    over:boolean,
    whyOver:gameOverReasons
    winner:boolean,// The winner gets true and the un-winner gets false
    move:string,
    whiteTimeLeft:number,
    blackTimeLeft:number,
}

// [SourceRow,SourceCol,TargetRow,TargetCol]
export type moveIndex = [number,number,number,number];
