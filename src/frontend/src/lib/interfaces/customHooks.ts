import { create } from "zustand";
import { Pieces, type color, type gameTypes } from "../../../../common/interfaces/enums";
import { gameState as gameStateType } from "@/pages/play/lib";
import type { Board, moveSocketResponse, startGameResponse } from "../../../../common/interfaces/game";
import { initBoard, moveCharsToIndex } from "../../../../common/game";
import { color as colors } from "../../../../common/interfaces/enums";
import { startGame } from "../network/websocket";
import { useOnMessageHandlerState } from "./onMessageHandlerState";

// Sounds
const normalMoveAudio = new Audio("/move-self.mp3");
const captureMoveAudio = new Audio("/capture.mp3");
normalMoveAudio.volume = 0.5;
captureMoveAudio.volume = 0.5;

export interface gameStartState{
    gameType:gameTypes|null,
    gameState:gameStateType,
    color:color|null,
    gameIncrement:number|null,
    socket:WebSocket|null,
    board:Board,
    setGameState:(gameState:gameStateType) => void,
        setGameType:(gameType:gameTypes) => void,
        setColor:(color:color) => void,
        setGameIncrement:(gameIncrement:number) => void,
        setSocket:(socket:WebSocket) => void,
        setBoard:(board:Board) => void,
        connect:(color:colors,gameType:gameTypes,increment:number,setStart:React.Dispatch<React.SetStateAction<boolean>>) => void,
    disconnect:() => void
}

export const useGame = create<gameStartState>((set) => ({
    gameType:null,
    color:null,
    gameIncrement:null,
    socket:null,
    gameState:gameStateType.waiting,
    board:initBoard(),
    setGameState:(gameState:gameStateType) => set({gameState}),
        setGameType:(gameType:gameTypes) => set({gameType}),
        setColor:(color:color) => set({color}),
        setGameIncrement:(gameIncrement:number) => set({gameIncrement}),
        setSocket:(socket:WebSocket) => set({socket}),
        setBoard:(board:Board) => set({board}),
        disconnect:() => {
        useGame.getState().socket?.close();
    },
        connect:(color:colors,gameType:gameTypes,increment:number,setStart:React.Dispatch<React.SetStateAction<boolean>>) => {
            const socket = startGame(color,gameType,increment);
            socket.onopen = () => {
                set({color,gameType,gameIncrement:increment,socket:socket})
                setStart(true);
            }
            socket.onerror = (err) => {
                console.error("Error starting game",err);
                alert("Error starting game");
            }
            /*
             * A message could mean a couple of things
             * 1-> Message to indicate start of game
             * 2-> Message to indicate end of game
             * 3-> Message to give a move by other player
             * 4-> Message to confirm the move made by current player
             */
            socket.onmessage = ((message:MessageEvent<any>) => {
                let data = JSON.parse(message.data);
                const {inMove,pieceMoved,setInMove,setWinner,} = useOnMessageHandlerState.getState();
                const {gameState,setGameState,board,setBoard,setColor,color} = useGame.getState();
                // Handle starting of game
                if(gameState == gameStateType.waiting){
                    data = data as startGameResponse;
                    if(data.start){
                        setGameState(gameStateType.running);
                        setColor(data.color);
                    }
                }
                else{
                    data = data as moveSocketResponse;
                    // Handle move made by current player being conformed
                    if(inMove){
                        setInMove(false)
                        if(!data.error){
                            const moveIndex = moveCharsToIndex(data.move);
                            if(moveIndex){
                                const [sRow,sCol,tRow,tCol] = moveIndex;
                                let newBoard = structuredClone(board);
                                newBoard[tRow][tCol] = pieceMoved;
                                newBoard[sRow][sCol] = Pieces.NN;
                                setBoard(newBoard);

                                // Play sound
                                if(board[tRow][tCol] == Pieces.NN){
                                    normalMoveAudio.play();
                                }
                                else{
                                    captureMoveAudio.play();
                                }
                            }
                            // If game ended
                            if(data.over){
                                setGameState(gameStateType.ended);
                                const colorC = color ? color : colors.White;
                                if(data.winner){
                                    setWinner(colorC)
                                }
                                else{
                                    setWinner(colorC == colors.White ? colors.Black : colors.White);
                                }
                            }
                        }
                    }
                    // Handle other player making a move
                    else if(!data.over){
                        const moveIndex = moveCharsToIndex(data.move);
                        if(moveIndex){
                            const [sRow,sCol,tRow,tCol] = moveIndex;
                            let newBoard = structuredClone(board);
                            newBoard[sRow][sCol] = Pieces.NN;
                            newBoard[tRow][tCol] = board[sRow][sCol];
                            setBoard(newBoard)

                            // Play sound
                            if(board[tRow][tCol] == Pieces.NN){
                                normalMoveAudio.play();
                            }
                            else{
                                captureMoveAudio.play();
                            }
                        }
                    }
                    // Handle game ending
                    else{
                        setGameState(gameStateType.ended);
                        const colorC = color ? color : colors.White;
                        if(data.winner){
                            setWinner(colorC)
                        }
                        else{
                            setWinner(colorC == colors.White ? colors.Black : colors.White);
                        }
                    }
                }
            })
        }
}
))
