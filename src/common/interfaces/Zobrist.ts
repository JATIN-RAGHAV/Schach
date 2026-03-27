import { color as colors, Pieces, specialMoveFlagsEnums } from "./enums";
import { rowSize } from "./constants";
import type { Board, moveIndex, Row } from "./game";

interface pieceSquare{
    piece:Pieces;
    square:[number,number]
}
// One number for each piece at each square
// One number to indicate the side to move is black
// Four numbers to indicate the castling rights, though usually 16 (2^4) are used for speed
// Eight numbers to indicate the file of a valid En passant square, if any

export class Zobrist {
    // Map the pieces and moves to a random number
    private static pieceSquareHashes= new Map<string,bigint >();
    private static chanceHahses = new Map<colors, bigint>();
    private static castleHashes = new Map<specialMoveFlagsEnums, bigint>();

    // Function which generates random 64 bit numbers
    private static getRandomNumber():bigint{
        const low = BigInt(Math.floor(Math.random() * (1<<31)));
        const high = BigInt(Math.floor(Math.random() * (1<<31)));
        return (high << 32n) | low;
    }

    // Convert piece and square to a string
    private static pieceSquareToString = (pieceSquare:pieceSquare) => {
        return `${pieceSquare.piece}-${pieceSquare.square[0]}${pieceSquare.square[1]}`;
    }

    // initialise the hashes
    public static init(){
        // Initialise the piece and square hash
        for(let cRow=0;cRow<rowSize;cRow++){
            for(let cCol=0;cCol<rowSize;cCol++){
                // Go through each piece
                // Get the numberical values from the enum and add them to the map
                for(let piece of Object.values(Pieces)){
                    this.pieceSquareHashes.set(this.pieceSquareToString({piece,square:[cRow,cCol]}),Zobrist.getRandomNumber());
                }
            }
        }

        // Initialise the chance hashes
        this.chanceHahses.set(colors.White,Zobrist.getRandomNumber());
        this.chanceHahses.set(colors.Black,Zobrist.getRandomNumber());

        // Initialise the flag hashes for castling right and not for enpasssant
        // One random value for each possible states for the castling rights, 16 in total
        for(let i = 0;i<16;i++){
            this.castleHashes.set(i,Zobrist.getRandomNumber());
        }
    }


    // Getter functions for pieces and falgs and chance
    private static getPieceSquareHash = (pieceSquare:pieceSquare) => {
        return this.pieceSquareHashes.get(this.pieceSquareToString(pieceSquare)) as bigint;
    }
    private static getChanceHash = (color:colors) => {
        return this.chanceHahses.get(color) as bigint;
    }
    private static getCastleHash = (flag:specialMoveFlagsEnums) => {
        let lower = flag & 0b1111;
        return this.castleHashes.get(lower) as bigint;
    }

    // Get an initial hash value
    public static getInitialBoardHash = () => {
        let hash = BigInt(0);
        return hash;
    }

    // Get new hash for move
    // Take xor with the previous hash values and then again with the new values
    public static getNextHash = (hash:bigint,move:moveIndex,board:Board,color:colors,specialMovesFlagsOld:specialMoveFlagsEnums,specialMovesFlagsNew:specialMoveFlagsEnums) => {
        // Get the details about the move
        const [sRow,sCol,tRow,tCol] = move;
        const sourceRow = board[sRow] as Row;
        const targetRow = board[tRow] as Row;
        const sourceSquare = sourceRow[sCol] as Pieces;
        const targetSquare = targetRow[tCol] as Pieces;

        // Update the spieceSquare flags
        hash ^= this.getPieceSquareHash({piece:targetSquare,square:[tRow,tCol]});
        hash ^= this.getPieceSquareHash({piece:sourceSquare,square:[sRow,sCol]});

        // Update the chance flag
        hash ^= this.getChanceHash(color);
        hash ^= this.getChanceHash(color == colors.White ? colors.Black : colors.White);

        // Update the castling rights
        hash ^= this.getCastleHash(specialMovesFlagsOld);
        hash ^= this.getCastleHash(specialMovesFlagsNew);

        return hash;
    }
}
