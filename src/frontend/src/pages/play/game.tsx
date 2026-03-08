import { useGame } from "@/main";

export const Play = () => {
    const game = useGame();
        return (
            <div className='game'>
                <h1>Game Type: {game.gameType}</h1>
                <h1>Color: {game.color}</h1>
                <h1>Increment: {game.gameIncrement}</h1>
        </div>)
}
