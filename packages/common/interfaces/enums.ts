import type { gameOverReasons } from "./game";

export enum color {
    Black = 'Black',
    White = 'White',
    Random = 'Random'
}

export enum Pieces{
    WR = 'WR',WN = 'WN',WB = 'WB',WQ = 'WQ',WK = 'WK',WP = 'WP',
    BR = 'BR',BN = 'BN',BB = 'BB',BQ = 'BQ',BK = 'BK',BP = 'BP',
    NN = 'NN'
}

// Game Types
export enum gameTypes{
    Rapid = 'Rapid',
    Blitz = 'Blitz',
    Bullet = 'Bullet'
}

// Pieces without colors
export enum purePieces{
    R = 'R',N = 'N',B = 'B',K = 'K',Q = 'Q',P = 'P',NN = 'NN'
};

// Flags which indicate special moves
export enum specialMoveFlagsEnums{
    WAR=(1<<1), // 10
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
    WARook = 'WARook',
    WHRook = 'WHRook',
    BARook = 'BARook',
    BHRook = 'BHRook',
}

// State of the game,returned by isGameEnded
export interface gameState{
    over:boolean; // If true then then game is over
    gameEndReason:gameOverReasons;
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
export const pawnEnPassant = new Map<string,specialMoveFlagsEnums>();
// Add the white pawns
// Keys => row + col, as a string, for eg: [1,0] => 10
pawnEnPassant.set("10",specialMoveFlagsEnums.WP0);
pawnEnPassant.set("11",specialMoveFlagsEnums.WP1);
pawnEnPassant.set("12",specialMoveFlagsEnums.WP2);
pawnEnPassant.set("13",specialMoveFlagsEnums.WP3);
pawnEnPassant.set("14",specialMoveFlagsEnums.WP4);
pawnEnPassant.set("15",specialMoveFlagsEnums.WP5);
pawnEnPassant.set("16",specialMoveFlagsEnums.WP6);
pawnEnPassant.set("17",specialMoveFlagsEnums.WP7);
// Add the black pawns
pawnEnPassant.set("60",specialMoveFlagsEnums.BP0);
pawnEnPassant.set("61",specialMoveFlagsEnums.BP1);
pawnEnPassant.set("62",specialMoveFlagsEnums.BP2);
pawnEnPassant.set("63",specialMoveFlagsEnums.BP3);
pawnEnPassant.set("64",specialMoveFlagsEnums.BP4);
pawnEnPassant.set("65",specialMoveFlagsEnums.BP5);
pawnEnPassant.set("66",specialMoveFlagsEnums.BP6);
pawnEnPassant.set("67",specialMoveFlagsEnums.BP7);

// Pieces to emoji for printing on terminal
export const pieceToEmoji = new Map<Pieces,string>();
pieceToEmoji.set(Pieces.WR,"♜");
pieceToEmoji.set(Pieces.WN,"♞");
pieceToEmoji.set(Pieces.WB,"♝");
pieceToEmoji.set(Pieces.WQ,"♛");
pieceToEmoji.set(Pieces.WK,"♚");
pieceToEmoji.set(Pieces.WP,"♟");
pieceToEmoji.set(Pieces.BR,"♖");
pieceToEmoji.set(Pieces.BN,"♘");
pieceToEmoji.set(Pieces.BB,"♗");
pieceToEmoji.set(Pieces.BQ,"♕");
pieceToEmoji.set(Pieces.BK,"♔");
pieceToEmoji.set(Pieces.BP,"♙");
pieceToEmoji.set(Pieces.NN," ");
