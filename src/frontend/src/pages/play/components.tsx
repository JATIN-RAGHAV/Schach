import { BlackKing, WhiteKing } from "@/assets/pieces"
import { Button } from "@/components/ui/button"
import { color as colors } from "../../../../common/interfaces/enums"
import { Board } from "@/components/ui/board"
import type { moveSocketRequest } from "../../../../common/interfaces/game"
import { useGameState } from "@/lib/states/gameState"
import { useEffect, useState } from "react"
import { formatTime, getCellSize, oppositeColor } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export const PlayPage = () => {
    const {color,socket,whiteUserName,blackUserName,setInMove} = useGameState();
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
        const {whoseChance} = useGameState.getState();
        if(whoseChance == color) {
            const res:moveSocketRequest= {
                move,
                isMessage: false
            }
            if(socket){
                socket.send(JSON.stringify(res));
                setInMove(true);
            }
        }
    }

    console.log(whiteUserName)
    console.log(blackUserName)
    return (
        <div>

            {/* Board on left and options and moves on right*/}
            <div className="flex gap-4 justify-center">
                <div className="flex flex-col">
                    {/* Top of Board Game Info */}
                    <div>
                        <h1>{boardSide == colors.White ? blackUserName : whiteUserName}</h1>
                        <Time color={oppositeColor(boardSide)}/>
                    </div>

                    {/* Board */}
                    <div>
                        <Board boardSide={boardSide}  makeMove={makeMove} />
                    </div>

                    {/* Bottom of Board Game Info */}
                    <div>
                        <h1>{boardSide == colors.White ? whiteUserName : blackUserName}</h1>
                        <Time color = {boardSide}/>
                    </div>
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

const Time = ({color}:{color:colors}) => {
    let timeLeft = 0;
    if(color == colors.White){
        timeLeft = useGameState.getState().whiteTimeLeft;
    }
    else{
        timeLeft = useGameState.getState().blackTimeLeft;
    }
    console.log(timeLeft)
    return <h1>{formatTime(timeLeft)}</h1>
}
