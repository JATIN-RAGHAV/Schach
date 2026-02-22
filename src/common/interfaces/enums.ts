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
export enum specialMoveFlagsEnums{
    WAR=(1<<1),
    WHR=(1<<2),
    BAR=(1<<3),
    BHR=(1<<4),
    WP0=(1<<5),
    WP1=(1<<6),
    WP2=(1<<7),
    WP3=(1<<8),
    WP4=(1<<9),
    WP5=(1<<10),
    WP6=(1<<11),
    WP7=(1<<12),
    BP0=(1<<13),
    BP1=(1<<14),
    BP2=(1<<15),
    BP3=(1<<16),
    BP4=(1<<17),
    BP5=(1<<18),
    BP6=(1<<19),
    BP7=(1<<20),
}

export const smallestEnPassantPawnBit = specialMoveFlagsEnums.WP0;

export enum specialMovepiece{
    WARook,
    WHRook,
    BARook,
    BHRook
}

export enum hasWon{
    Yes,
    No,
    Draw
}

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
export const pawnEnPassant = new Map<[number,number],specialMoveFlagsEnums>();
// Add the white pawns
pawnEnPassant.set([1,0],specialMoveFlagsEnums.WP0);
pawnEnPassant.set([1,1],specialMoveFlagsEnums.WP1);
pawnEnPassant.set([1,2],specialMoveFlagsEnums.WP2);
pawnEnPassant.set([1,3],specialMoveFlagsEnums.WP3);
pawnEnPassant.set([1,4],specialMoveFlagsEnums.WP4);
pawnEnPassant.set([1,5],specialMoveFlagsEnums.WP5);
pawnEnPassant.set([1,6],specialMoveFlagsEnums.WP6);
pawnEnPassant.set([1,7],specialMoveFlagsEnums.WP7);
// Add the black pawns
pawnEnPassant.set([rowSize-2,0],specialMoveFlagsEnums.BP0);
pawnEnPassant.set([rowSize-2,1],specialMoveFlagsEnums.BP1);
pawnEnPassant.set([rowSize-2,2],specialMoveFlagsEnums.BP2);
pawnEnPassant.set([rowSize-2,3],specialMoveFlagsEnums.BP3);
pawnEnPassant.set([rowSize-2,4],specialMoveFlagsEnums.BP4);
pawnEnPassant.set([rowSize-2,5],specialMoveFlagsEnums.BP5);
pawnEnPassant.set([rowSize-2,6],specialMoveFlagsEnums.BP6);
pawnEnPassant.set([rowSize-2,7],specialMoveFlagsEnums.BP7);
