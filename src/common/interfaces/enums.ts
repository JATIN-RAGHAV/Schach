import { rowSize } from "./constants";

export enum color {
    Black,
    White,
    Random,
}

export enum Pieces{
    WR,WN,WB,WK,WQ,WP,
    BR,BN,BB,BK,BQ,BP,
    NN
}

// Pieces without colors
export enum purePieces{
    R,N,B,K,Q,P,NN
};

// Flags which indicate special moves
export enum specialFlags{
    WAR=(1<<1),
    WHR=(1<<2),
    WK=(1<<3),
    WP0=(1<<4),
    WP1=(1<<5),
    WP2=(1<<6),
    WP3=(1<<7),
    WP4=(1<<8),
    WP5=(1<<9),
    WP6=(1<<10),
    WP7=(1<<11),
    BP0=(1<<12),
    BP1=(1<<13),
    BP2=(1<<14),
    BP3=(1<<15),
    BP4=(1<<16),
    BP5=(1<<17),
    BP6=(1<<18),
    BP7=(1<<19),
    BAR=(1<<20),
    BHR=(1<<21),
    BK=(1<<22),
}

export enum specialMovepiece{
    King,
    ARook,
    HRook
}


export interface specialMovesKey {
    color:color,
    piece:specialMovepiece
}

export const moveToSpecialFlag = new Map<specialMovesKey,specialFlags>();
moveToSpecialFlag.set({color:color.White,piece:specialMovepiece.King},specialFlags.WK);
moveToSpecialFlag.set({color:color.White,piece:specialMovepiece.ARook},specialFlags.WAR);
moveToSpecialFlag.set({color:color.White,piece:specialMovepiece.King},specialFlags.WHR);
moveToSpecialFlag.set({color:color.Black,piece:specialMovepiece.King},specialFlags.BK);
moveToSpecialFlag.set({color:color.Black,piece:specialMovepiece.ARook},specialFlags.BAR);
moveToSpecialFlag.set({color:color.Black,piece:specialMovepiece.King},specialFlags.BHR);

export const piecesColorMap = new Map<Pieces,color>();
piecesColorMap.set(Pieces.WR,color.White);
piecesColorMap.set(Pieces.WN,color.White);
piecesColorMap.set(Pieces.WB,color.White);
piecesColorMap.set(Pieces.WQ,color.White);
piecesColorMap.set(Pieces.WK,color.White);
piecesColorMap.set(Pieces.WP,color.White);
piecesColorMap.set(Pieces.BR,color.Black);
piecesColorMap.set(Pieces.BN,color.Black);
piecesColorMap.set(Pieces.BB,color.Black);
piecesColorMap.set(Pieces.BQ,color.Black);
piecesColorMap.set(Pieces.BK,color.Black);
piecesColorMap.set(Pieces.BP,color.Black);
piecesColorMap.set(Pieces.NN,color.Random);

export const purePiecesMap = new Map<Pieces,purePieces>();
purePiecesMap.set(Pieces.WR,purePieces.R)
purePiecesMap.set(Pieces.BR,purePieces.R)
purePiecesMap.set(Pieces.WN,purePieces.N)
purePiecesMap.set(Pieces.BN,purePieces.N)
purePiecesMap.set(Pieces.WB,purePieces.B)
purePiecesMap.set(Pieces.BB,purePieces.B)
purePiecesMap.set(Pieces.WQ,purePieces.Q)
purePiecesMap.set(Pieces.BQ,purePieces.Q)
purePiecesMap.set(Pieces.WK,purePieces.K)
purePiecesMap.set(Pieces.BK,purePieces.K)
purePiecesMap.set(Pieces.WP,purePieces.P)
purePiecesMap.set(Pieces.BP,purePieces.P)
purePiecesMap.set(Pieces.NN,purePieces.NN)

// Maps origin cordinates of a pawn to their special flags
// If special flag on then the pawn at that cordinate moved by 2 squares in the last move
export const pawnEnPassant = new Map<[number,number],specialFlags>();
// Add the white pawns
pawnEnPassant.set([1,0],specialFlags.WP0);
pawnEnPassant.set([1,1],specialFlags.WP1);
pawnEnPassant.set([1,2],specialFlags.WP2);
pawnEnPassant.set([1,3],specialFlags.WP3);
pawnEnPassant.set([1,4],specialFlags.WP4);
pawnEnPassant.set([1,5],specialFlags.WP5);
pawnEnPassant.set([1,6],specialFlags.WP6);
pawnEnPassant.set([1,7],specialFlags.WP7);
// Add the black pawns
pawnEnPassant.set([rowSize-2,0],specialFlags.BP0);
pawnEnPassant.set([rowSize-2,1],specialFlags.BP1);
pawnEnPassant.set([rowSize-2,2],specialFlags.BP2);
pawnEnPassant.set([rowSize-2,3],specialFlags.BP3);
pawnEnPassant.set([rowSize-2,4],specialFlags.BP4);
pawnEnPassant.set([rowSize-2,5],specialFlags.BP5);
pawnEnPassant.set([rowSize-2,6],specialFlags.BP6);
pawnEnPassant.set([rowSize-2,7],specialFlags.BP7);
