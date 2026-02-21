import { purePieces } from "./interfaces/enums";

// This will map the pieces to the moves that they can make
let Moves = new Map<purePieces,{
    moves:[number,number][],
    depth:number
}>();

// Add moves for the king
Moves.set(purePieces.K,{
    moves:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],
    depth:1
})

// Add moves for the queen
Moves.set(purePieces.Q,{
    moves:[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]],
    depth:8
})

// Add moves for the rook
Moves.set(purePieces.R,{
    moves:[[-1,0],[0,-1],[0,1],[1,0]],
    depth:8
})

// Add moves for the bishop
Moves.set(purePieces.B,{
    moves:[[-1,-1],[-1,1],[1,-1],[1,1]],
    depth:8
})

// Add moves for the knight
Moves.set(purePieces.N,{
    moves:[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]],
    depth:1
})

export default Moves;
