import { BlackKing, WhiteKing } from "@/assets/pieces"
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

    return (
        <div className="flex w-full justify-center">

            {/* Board on left and options and moves on right*/}
            <div className="w-auto">
                <div className="grid grid-rows-[auto_auto_auto] grid-cols-[auto_auto_auto]">

                    {/* Top of Board Game Info */}
                    <div className="my-2 flex flex-col w-full gap-1 ">
                        <h1 className="font-bold">{boardSide == colors.White ? blackUserName : whiteUserName}</h1>
                        <Time color={oppositeColor(boardSide)}/>
                    </div>

                    {/* Board */}
                    <div className="row-start-2">
                        <Board boardSide={boardSide} makeMove={makeMove} />
                    </div>

                    {/* Options */}
                    <div className="row-start-2 col-start-2 m-3 flex flex-col md:flex-row gap-2">
                        <div onClick={handleBoardFlipbuttonClick} className="w-min h-min px-2 py-1 bg-secondary rounded-sm">
                            {
                                boardSide == colors.White ? <WhiteKing size={25}/> : <BlackKing size={25}/>
                            }
                        </div>
                    </div>

                    {/* Moves */}
                    <Moves />

                    {/* Bottom of Board Game Info */}
                    <div className="my-2 flex flex-col w-full items-end row-start-3 col-start-1">
                        <h1 className="font-bold">{boardSide == colors.White ? whiteUserName : blackUserName}</h1>
                        <Time color = {boardSide}/>
                    </div>
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
    return <h1 className="px-3 py-1 border rounded-3xl w-min bg-secondary">{formatTime(timeLeft)}</h1>
}

export const Moves = () => {
    const {moves} = useGameState();
    return <div className="min-w-36 gap-4 flex flex-col align-middle items-center rounded-sm row-start-4 font-extrabold col-start-1 md:row-start-2 md:col-start-3 bg-secondary p-2">
        <div>
            Moves
        </div>
        <div className="w-full flex flex-col gap-1">
            {moves.map((e,i) => {
                return <div key={i} className={`px-3 py-1 rounded-sm w-min ${i%2 ? 'bg-black text-white' : 'bg-white text-black'}`}>{e}</div>
            }
            )}
        </div>
    </div>
}
