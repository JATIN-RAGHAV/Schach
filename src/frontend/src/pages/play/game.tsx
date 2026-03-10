import { useGame } from "@/main";
import { Board } from "@/components/ui/board";
import { initBoard } from "../../../../common/game";
import type { Board as BoardType} from "../../../../common/interfaces/game";
import { color as colors } from "../../../../common/interfaces/enums";
import { useState } from "react";

export const Play = () => {
    const game = useGame();
    const [board,setBoard] = useState<BoardType>(initBoard());
        return (
            <div className='game'>
                <h1>Game Type: {game.gameType}</h1>
                <h1>Color: {game.color}</h1>
                <h1>Increment: {game.gameIncrement}</h1>
                <Board board={board} setBoard={setBoard} color={game.color || colors.White}/>
        </div>)

}
