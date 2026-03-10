import { useGame } from "@/main";
import { Board } from "@/components/ui/board";
import { initBoard, moveCharsToIndex } from "../../../../common/game";
import type { Board as BoardType,moveSocketResponse, startGameResponse,moveSocketRequest } from "../../../../common/interfaces/game";
import { color as colors, Pieces } from "../../../../common/interfaces/enums";
import { useEffect, useRef, useState } from "react";
import { gameState as gameStateType} from "./lib";

export const Play = () => {
    const game = useGame();
    const inMoveRef = useRef<boolean>(false);
    const [gameState,setGameState] = useState<gameStateType>(game.gameState);
    const [board,setBoard] = useState<BoardType>(initBoard());
    const winnerRef = useRef<colors>(colors.Random);
    const pieceMovedRef = useRef<Pieces>(Pieces.NN);

    // Function to pass to board component to call and make a move
    const makeMove = (move:string) => {
        const res:moveSocketRequest = {
            move,
            isMessage: false
        }
        if(game.socket){
            game.socket.send(JSON.stringify(res));
            inMoveRef.current = true;
        }
    }

    console.log('hello there')

    useEffect(() => {
        if(game.socket != null){
            /*
             * A message could mean a couple of things
             * 1-> Message to indicate start of game
             * 2-> Message to indicate end of game
             * 3-> Message to give a move by other player
             * 4-> Message to confirm the move made by current player
             */
            console.log("on message working")
            game.socket.onmessage = ((message:MessageEvent<any>) => {
                let data = JSON.parse(message.data);
                // Handle starting of game
                console.log("original")
                console.log(data)
                if(game.gameState == gameStateType.waiting){
                    data = data as startGameResponse;
                    console.log("waiting")
                    if(data.start){
                        game.gameState = gameStateType.running;
                        setGameState(gameStateType.running);
                        game.color = data.color;
                        console.log('game STarted')
                    }
                }
                else{
                    console.log("not waiting")
                    data = data as moveSocketResponse;
                    // Handle move made by current player being conformed
                    if(inMoveRef.current){
                        console.log('move made by curretn player')
                        inMoveRef.current = false;
                        if(!data.error){
                            const moveIndex = moveCharsToIndex(data.move);
                            if(moveIndex){
                                const [sRow,sCol,tRow,tCol] = moveIndex;
                                setBoard(board => {
                                    let newBoard = structuredClone(board);
                                    newBoard[tRow][tCol] = pieceMovedRef.current;
                                    newBoard[sRow][sCol] = Pieces.NN;
                                    return newBoard;
                                });
                            }
                        }
                    }
                    // Handle other player making a move
                    else if(!data.over){
                        console.log("move made by other player")
                        const moveIndex = moveCharsToIndex(data.move);
                        if(moveIndex){
                            setBoard(board => {
                                const [sRow,sCol,tRow,tCol] = moveIndex;
                                let newBoard = structuredClone(board);
                                newBoard[sRow][sCol] = Pieces.NN;
                                newBoard[tRow][tCol] = board[sRow][sCol];
                                return newBoard;
                            });
                        }
                    }
                    // Handle game ending
                    else{
                        console.log("dead")
                        game.gameState = gameStateType.ended;
                        setGameState(gameStateType.ended);
                        const colorC = game.color || colors.White;
                        if(data.winner){
                            winnerRef.current = colorC;
                        }
                        else{
                            winnerRef.current = (colorC == colors.White ? colors.Black : colors.White);
                        }
                    }
                }
            })
        }
        else{
            console.log("empty socket")
        }
    },[])


    if(gameState == gameStateType.waiting){
        return <div>Loading...</div>
    }
    else if(gameState == gameStateType.running){
        return (
            <div className='game'>
            <h1>Game Type: {game.gameType}</h1>
            <h1>Color: {game.color}</h1>
            <h1>Increment: {game.gameIncrement}</h1>
            <Board board={board} setBoard={setBoard} color={game.color || colors.White} makeMove={makeMove} pieceMovedRef = {pieceMovedRef}/>
            </div>)

    }
    else{
        return <h1>
        Game Over
        <h2>
        Winner: {winnerRef.current}
        </h2>
        </h1>
    }
}
