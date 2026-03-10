import { PieceComponents } from "@/assets/pieces";
import { type Board as BoardType } from "../../../../common/interfaces/game";
import { useEffect, useRef, useState } from "react";
import { squareIndexToKey } from "@/lib/utils";
import {type color as colors, Pieces, piecesColorMap } from "../../../../common/interfaces/enums";
import { MousePieceDraggalbe } from "./mousePieceDraggable";

export const Board = ({board,color}:{board:BoardType,color:colors}) => {

    const boardRef = useRef<HTMLDivElement>(null);
    const [square,setSquare] = useState<string|null>(null);
    const pieceComponentRef = useRef<React.FC<{size: number;}>>(null);
    const squareRef = useRef<string>(null);

    useEffect(() => {

        // Function to handle mouse being clicked
        const handleMouseDown = (ev:MouseEvent) => {
            if(ev.button == 0){
                const mouseX = ev.clientX;
                const mouseY = ev.clientY;
                if (boardRef.current) {
                    const rect = boardRef.current.getBoundingClientRect();
                    const boardX = rect.left;
                    const boardY = rect.top;
                    const relativeX = mouseX - boardX;
                    const relativeY = mouseY - boardY;
                    const row = Math.floor(relativeY/cellSize);
                    const col = Math.floor(relativeX/cellSize);
                    const piece = board[row][col];
                    const notEmpty = piece != Pieces.NN;
                    const sameColor = piecesColorMap.get(piece) == color;
                    if(notEmpty && sameColor){
                        pieceComponentRef.current = PieceComponents[piece];
                        const newSquare = squareIndexToKey(row,col);
                        setSquare(newSquare);
                        squareRef.current = newSquare;
                    }
                }
            }
        }

        // Handle what happens when mouse click is unclicked
        const handleMouseUp = (ev:MouseEvent) => {
            if(squareRef.current != null){
                setSquare(null);
                squareRef.current = null;
                pieceComponentRef.current = null;
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
                    return <span key={squareIndexToKey(rowI,colI)} id={squareIndexToKey(rowI,colI)} className={` w-${cellSize}px h-${cellSize}px flex items-center justify-center ${((rowI + colI) % 2 === 0) ? 'bg-boardDark' : 'bg-boardLight'} ${square!=null ? "hover:bg-amber-50":""}`}>
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
