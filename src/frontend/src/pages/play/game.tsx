import { Board } from "@/components/ui/board";
import { useGame } from "@/lib/interfaces/customHooks";
import type { moveSocketRequest } from "../../../../common/interfaces/game";
import { color as colors } from "../../../../common/interfaces/enums";
import { useEffect, useState } from "react";
import { gameState as gameStateType} from "./lib";
import { Button } from "@/components/ui/button";
import { BlackKing, WhiteKing } from "@/assets/pieces";
import { useOnMessageHandlerState } from "@/lib/interfaces/onMessageHandlerState";

export const Play = () => {
    const [boardSide,setBoardSide] = useState<colors>(colors.Random);// Random means game has not started
    const {winner,setInMove} = useOnMessageHandlerState();
    const {color,socket,gameType,gameState,gameIncrement} = useGame();

    // Function to pass to board component to call and make a move
    const makeMove = (move:string) => {
        const res:moveSocketRequest = {
            move,
            isMessage: false
        }
        if(socket){
            socket.send(JSON.stringify(res));
            setInMove(true);
        }
    }

    const handleBoardFlipbuttonClick = () => {
        setBoardSide(boardSide => boardSide == colors.White ? colors.Black : colors.White);
    }


    useEffect(() => {
        // Random means game has not started
        if(boardSide == colors.Random){
            setBoardSide(color || colors.Random);
        }
    },[color])


    if(gameState == gameStateType.waiting){
        return <div>Loading...</div>
    }
    else if(gameState == gameStateType.running){
        return (
            <div className='game'>
            <h1>Game Type: {gameType}</h1>
            <h1>Color: {color}</h1>
            <h1>Increment: {gameIncrement}</h1>
            <Button onClick={handleBoardFlipbuttonClick}>
            {
                boardSide == colors.White ? <WhiteKing size={15}/> : <BlackKing size={15}/>
            }
            </Button>
            <Board boardSide={boardSide}  makeMove={makeMove} />
            </div>)

    }
    else{
        return <h1>
        Game Over
        <h2>
        Winner: {winner}
        </h2>
        </h1>
    }
}
