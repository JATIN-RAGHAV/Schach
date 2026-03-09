import { PieceComponents } from "@/assets/pieces";
import { type Board as BoardType } from "../../../../common/interfaces/game";

export const Board = ({board}:{board:BoardType}) => {
    const windowWidth = window.innerWidth;
    let cellSize = 45;
    if(windowWidth <= 500){
        cellSize = (windowWidth*0.9)/8;
    }
    else{
        cellSize = (windowWidth*0.50)/8;
    }
    return <div className="w-full flex items-center justify-center">
    <div id="board" className={`w-[${cellSize * 8}px] h-[${cellSize*8}px] flex border rounded-xl overflow-clip flex-col items-center justify-center`}>{
        board.map((row,rowI) => {
            return <div className={`w-full h-${cellSize}px flex flex-row items-center justify-center`}>
            {
                row.map((cell,colI) => {
                    const Piece = PieceComponents[cell];
                    return <span className={`w-${cellSize}px h-${cellSize}px flex items-center justify-center ${((rowI + colI) % 2 === 0) ? 'bg-boardDark' : 'bg-boardLight'}`}>
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
