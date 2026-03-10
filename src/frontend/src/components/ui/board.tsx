import { PieceComponents } from "@/assets/pieces";
import { type Board as BoardType } from "../../../../common/interfaces/game";
import { useEffect, useRef } from "react";
import { squareIndexToKey, squareKeyToIndex } from "@/lib/utils";
import {type color as colors, Pieces, piecesColorMap } from "../../../../common/interfaces/enums";
import { MousePieceDraggalbe } from "./mousePieceDraggable";

export const Board = ({board,color,setBoard}:{board:BoardType,color:colors,setBoard:React.Dispatch<React.SetStateAction<BoardType>>}) => {

    // A reference to the whole board, to get cordiantes to the board
    const boardRef = useRef<HTMLDivElement>(null);
    // The piece that is currently dragged under the cursor
    const pieceComponentRef = useRef<React.FC<{size: number;}>>(null);
    // We must use reference here because when we define the mouseUpHandler function we need the latest value of the square which was clicked
    const squareRef = useRef<string>(null);
    const pieceRef = useRef<Pieces>(null);

    useEffect(() => {

        // Function to handle mouse being clicked
        const handleMouseDown = (ev:MouseEvent) => {
            if(ev.button == 0){
                // Get the mouse cordinates and also relative cordinates
                const mouseX = ev.clientX;
                const mouseY = ev.clientY;
                if (boardRef.current) {
                    const rect = boardRef.current.getBoundingClientRect();
                    const boardX = rect.left;
                    const boardY = rect.top;
                    const relativeX = mouseX - boardX;
                    const relativeY = mouseY - boardY;
                    
                    // Get info about the piece at the cliecked square
                    const row = Math.floor(relativeY/cellSize);
                    const col = Math.floor(relativeX/cellSize);
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
                        pieceRef.current = piece;
                        newBoard[row][col] = Pieces.NN;
                        setBoard(newBoard);
                    }
                }
            }
        }

        // Handle what happens when mouse click is unclicked
        const handleMouseUp = (ev:MouseEvent) => {
            if(squareRef.current != null){
                const [row,col] = squareKeyToIndex(squareRef.current);
                squareRef.current = null;
                pieceComponentRef.current = null;
                let newBoard = structuredClone(board);
                if(pieceRef.current != null){
                    newBoard[row][col] = pieceRef.current;
                    setBoard(newBoard)
                }
                pieceRef.current = null;
                console.log(ev)
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
