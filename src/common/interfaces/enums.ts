
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

export enum purePieces{
    R,N,B,K,Q,P,NN
};

export enum specialFlags{
    WAR=(1<<1),
    WHR=(1<<2),
    WK=(1<<3),
    BAR=(1<<4),
    BHR=(1<<5),
    BK=(1<<6),
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
