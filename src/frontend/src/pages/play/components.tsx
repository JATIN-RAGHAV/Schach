import { BlackKing, WhiteKing } from "@/assets/pieces"
import { Button } from "@/components/ui/button"
import { color as colors } from "../../../../common/interfaces/enums"
import { Board } from "@/components/ui/board"
import type { moveSocketRequest } from "../../../../common/interfaces/game"
import { useOnMessageHandlerState } from "@/lib/interfaces/onMessageHandlerState"
import { useGame } from "@/lib/interfaces/customHooks"
import { useEffect, useState } from "react"
import { getCellSize } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export const PlayPage = () => {
    const {color,socket,gameType,gameIncrement} = useGame();
    const {setInMove} = useOnMessageHandlerState();
    const [boardSide,setBoardSide] = useState<colors>(colors.Random);// Random means game has not started
    const handleBoardFlipbuttonClick = () => {
        setBoardSide(boardSide => boardSide == colors.White ? colors.Black : colors.White);
    }

    useEffect(() => {
        // Random means game has not started
        if(boardSide == colors.Random){
            setBoardSide(color || colors.Random);
        }
    },[color])

    // Function to pass to board component to call and make a move
    const makeMove = (move:string) => {
        const res:moveSocketRequest= {
            move,
            isMessage: false
        }
        if(socket){
            socket.send(JSON.stringify(res));
            setInMove(true);
        }
    }

    return (
        <div>

            {/* Game Info */}
            <div>
                <h1>Game Type: {gameType}</h1>
                <h1>Color {color}</h1>
                <h1>Increment: {gameIncrement}</h1>
            </div>

            {/* Board on left and options and moves on right*/}
            <div className="flex gap-4 justify-center">
                {/* Board */}
                <div>
                    <Board boardSide={boardSide}  makeMove={makeMove} />
                </div>
                {/* Options */}
                <div>
                    <Button onClick={handleBoardFlipbuttonClick}>
                        {
                            boardSide == colors.White ? <WhiteKing size={25}/> : <BlackKing size={25}/>
                        }
                    </Button>
                </div>
            </div>
        </div>

    )
}

export const PlayLoading = () => {
    const cellSize = getCellSize();
    const boardSize = cellSize*8;
    return <div className="flex flex-col justify-center h-dvh items-center gap-6">
        <div className="font-bold text-4xl">Finding an Opponent..... </div>
        <Skeleton className="z-0" style={{width:boardSize,height:boardSize}}>
        </Skeleton>
    </div>
}
