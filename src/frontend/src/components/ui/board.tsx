import { PieceComponents } from "@/assets/pieces";
import { type Board as BoardType } from "../../../../common/interfaces/game";
import { useEffect, useRef } from "react";
import { squareIndexToKey, squareKeyToIndex } from "@/lib/utils";
import {type color as colors, Pieces, piecesColorMap } from "../../../../common/interfaces/enums";
import { MousePieceDraggalbe } from "./mousePieceDraggable";
import { isMoveOk, moveIndexToChars } from "../../../../common/game";

export const Board = ({board,color,setBoard,makeMove,pieceMovedRef}:{board:BoardType,color:colors,setBoard:React.Dispatch<React.SetStateAction<BoardType>>,makeMove:(move:string)=>void,pieceMovedRef:React.RefObject<Pieces>}) => {

    // A reference to the whole board, to get cordiantes to the board
    const boardRef = useRef<HTMLDivElement>(null);
    // The piece that is currently dragged under the cursor
    const pieceComponentRef = useRef<React.FC<{size: number;}>>(null);
    // We must use reference here because when we define the mouseUpHandler function we need the latest value of the square which was clicked
    const squareRef = useRef<string>(null);

    useEffect(() => {

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
                        setBoard(board => {
                            let newBoard =  structuredClone(board);
                            pieceMovedRef.current = piece;
                            newBoard[row][col] = Pieces.NN;
                            return newBoard;
                        });
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
                if(targetRow != -1){
                    const moveString = moveIndexToChars([sourceRow,sourceCol,targetRow,targetCol]);
                    const isValidMove = isMoveOk(board,moveString,color,0);
                    // If valid move then make the move
                    if(isValidMove){
                        makeMove(moveString);
                    }
                }

                // Clean up
                setBoard(board => {
                    let newBoard = structuredClone(board);
                    if(pieceMovedRef.current != null){
                        newBoard[sourceRow][sourceCol] = pieceMovedRef.current;
                    }
                    return newBoard;
                })
                squareRef.current = null;
                pieceComponentRef.current = null;
            }
        }

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
    }, []); // Empty dependency array means this runs once on mount

    const windowWidth = window.innerWidth;
    let cellSize = 45;
    if(windowWidth <= 500){
        cellSize = (windowWidth*0.9)/8;
    }
    else{
        cellSize = (windowWidth*0.50)/8;
    }
    return <div className="w-full flex items-center justify-center">
    <MousePieceDraggalbe Piece={pieceComponentRef.current} size={cellSize} />
    <div ref={boardRef} className={`w-[${cellSize * 8}px] h-[${cellSize*8}px] flex border rounded-xl overflow-clip flex-col items-center justify-center`}>{
        board.map((row,rowI) => {
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
