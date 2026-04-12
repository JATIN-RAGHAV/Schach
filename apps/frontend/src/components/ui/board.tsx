import { PieceComponents } from "@/assets/pieces";
import { type Board as BoardType, type Row } from "@schach/common/interfaces/game";
import { useEffect, useRef } from "react";
import { getCellSize, squareIndexToKey, squareKeyToIndex } from "@/lib/utils";
import {color as colors, Pieces, piecesColorMap } from "@schach/common/interfaces/enums";
import { MousePieceDraggalbe } from "./mousePieceDraggable";
import { isMoveOk, moveIndexToChars } from "@schach/common/game";
import { useGameState } from "@/lib/states/gameState";

export const Board = ({makeMove,boardSide}:{makeMove:(move:string)=>void,boardSide:colors}) => {
    const {board,color,pieceMoved,setPieceMoved,setBoard} = useGameState.getState();
    // A reference to the whole board, to get cordiantes to the board
    const boardRef = useRef<HTMLDivElement>(null);
    // The piece that is currently dragged under the cursor
    const pieceComponentRef = useRef<React.FC<{size: number;}>>(null);
    // We must use reference here because when we define the mouseUpHandler function we need the latest value of the square which was clicked
    const squareRef = useRef<string>(null);
    const boardShownRef = useRef<BoardType>(board);

    boardShownRef.current = structuredClone(board);
    /*
     * By default we have a1 at the top left,
     * For White at bottom we have to swap the rows, ie: make row[0] = row[7]
     * For Black at bottom we have to swap the rows internally that is row[0][0] = row[0][7]
     */
    if(boardSide == colors.White){
        boardShownRef.current = boardShownRef.current.reverse() as BoardType;
    }
    else{
        for(let row of boardShownRef.current){
            row = row.reverse() as Row;
        }
    }

    // Function to get the square being clicked and [-1,-1] if outside
    const getSquareBeingClicked = (ev:MouseEvent) => {
        const mouseX = ev.clientX;
        const mouseY = ev.clientY;
        let row = -1;
        let col = -1;
        if (boardRef.current) {
            const rect = boardRef.current.getBoundingClientRect();
            const boardX = rect.left;
            const boardY = rect.top;
            const relativeX = mouseX - boardX;
            const relativeY = mouseY - boardY;
            row = Math.floor(relativeY/cellSize);
            col = Math.floor(relativeX/cellSize);
            if(row > 7 || row < 0 || col > 7 || col < 0){
                row = -1;
                col = -1;
            }
        }
        // In case of black we reverse the rows individually -> row[0][0] <=> row[0][7]
        if(row != -1){
            if(boardSide == colors.Black){
                col = 7 - col;
            }
            else{
                // In case of white we reversed the row -> row[0] <=> row[7]
                row = 7 - row;
            }
        }
        return [row,col];
    }

    // Get the square begin clicked
    // Function to handle mouse being clicked
    const handleMouseDown = (ev:MouseEvent) => {
        if(ev.button == 0){
            // Get the square being clicked
            const [row,col] = getSquareBeingClicked(ev);
            // If the square innside the board
            if(row != -1){
                const piece = board[row][col];
                const notEmpty = piece != Pieces.NN;
                const sameColor = piecesColorMap.get(piece) == color;
                // If correct then enable draggable piece and hide piece on the clicked square
                if(notEmpty && sameColor){
                    // Set the draggable piece
                    pieceComponentRef.current = PieceComponents[piece];
                    const newSquare = squareIndexToKey(row,col);
                    squareRef.current = newSquare;
                    // Also hide the piece on the clicked square
                    let newBoard =  structuredClone(board);
                    setPieceMoved(piece);
                    newBoard[row][col] = Pieces.NN;
                    setBoard(newBoard)
                }
            }
        }
    }
    // Handle what happens when mouse click is unclicked
    const handleMouseUp = (ev:MouseEvent) => {
        // If we were dragging a piece or not
        if(squareRef.current != null){
            // Get the source and targe squares
            const [sourceRow,sourceCol] = squareKeyToIndex(squareRef.current);
            const [targetRow,targetCol] = getSquareBeingClicked(ev);

            // Put the piece back
            let originalBoard = structuredClone(board);
            if(pieceMoved != null){
                originalBoard[sourceRow][sourceCol] = pieceMoved;
            }

            if(targetRow != -1){
                const moveString = moveIndexToChars([sourceRow,sourceCol,targetRow,targetCol]);
                const isValidMove = isMoveOk(originalBoard,moveString,color || colors.Random ,0);
                // If valid move then make the move
                if(isValidMove){
                    makeMove(moveString);
                }
            }

            // Reset the state
            setBoard(originalBoard)
            squareRef.current = null;
            pieceComponentRef.current = null;
        }
    }


    useEffect(() => {
        // Add even listener to mouse Being clicked
        if(boardRef.current){
            boardRef.current.addEventListener('mousedown', handleMouseDown);
        }
        document.addEventListener('mouseup', handleMouseUp);


        // Clean up the event listener when the component unmounts
        return () => {
            if(boardRef.current){
                boardRef.current.removeEventListener('mousedown',handleMouseDown);
            }
            document.removeEventListener('mouseup', handleMouseUp);
        };
    /*
     * Event Listener funciton has to be removed and added everytime that boardSide changes.
     * Because the getSquareBeingClicked function is dependant on the boardSide
     * Which affects the handler functions
    */
    }, [boardSide,boardRef,handleMouseDown,handleMouseUp]); 

    let cellSize = getCellSize();
    return <div className="w-full flex items-center justify-center">
    <MousePieceDraggalbe Piece={pieceComponentRef} size={cellSize} />
    <div ref={boardRef} className={`w-[${cellSize * 8}px] h-[${cellSize*8}px] flex border rounded-xl overflow-clip flex-col items-center justify-center`}>{
        boardShownRef.current.map((row,rowI) => {
            return <div key={`${rowI}`} className={`w-full h-${cellSize}px flex flex-row items-center justify-center`}>
            {
                row.map((cell,colI) => {
                    const Piece = PieceComponents[cell];
                    return <span key={squareIndexToKey(rowI,colI)} id={squareIndexToKey(rowI,colI)} className={` w-${cellSize}px h-${cellSize}px flex items-center justify-center ${((rowI + colI) % 2 === 0) ? 'bg-boardDark' : 'bg-boardLight'} ${squareRef.current!=null ? "hover:bg-amber-50":""}`}>
                    <Piece size={cellSize}/>
                    </span>
                })
            }
            </div>
        })
    }
    </div>
    </div>
}
