import { create } from "zustand";
import { Pieces, type color, type gameTypes } from "../../../../common/interfaces/enums";
import { gameState as gameStateType } from "@/pages/play/lib";
import type { Board, moveSocketResponse, startGameResponse } from "../../../../common/interfaces/game";
import { initBoard, moveCharsToIndex } from "../../../../common/game";
import { color as colors } from "../../../../common/interfaces/enums";
import { startGame } from "../network/websocket";
import { getTimeFromGameType, oppositeColor } from "../utils";
import { useUserState } from "./userState";

// Sounds
const normalMoveAudio = new Audio("/move-self.mp3");
const captureMoveAudio = new Audio("/capture.mp3");
normalMoveAudio.volume = 0.5;
captureMoveAudio.volume = 0.5;

export interface gameState{
    winner:color|null,
    pieceMoved:Pieces,
    inMove:boolean,
    gameType:gameTypes|null,
    gameState:gameStateType,
    color:color|null,
    gameIncrement:number|null,
    socket:WebSocket|null,
    board:Board,
    whiteUserName:string|null,
    blackUserName:string|null,
    whiteTimeLeft:number,
    blackTimeLeft:number,
    whoseChance:colors,
    timeUpdateInterval:number|null,
    startUpdatingTime:() => void,
    setWhoseChance:(color:colors) => void,
    setWhiteTimeLeft:(timeLeft:number) => void,
    setBlackTimeLeft:(timeLeft:number) => void,
    setWhiteUserName:(userName:string|null) => void,
    setBlackUserName:(userName:string|null) => void,
    setWinner:(color:color|null) => void,
    setPieceMoved:(piece:Pieces) => void,
    setInMove:(inMove:boolean) => void
    setGameState:(gameState:gameStateType) => void,
    setGameType:(gameType:gameTypes) => void,
    setColor:(color:color) => void,
    setGameIncrement:(gameIncrement:number) => void,
    setSocket:(socket:WebSocket) => void,
    setBoard:(board:Board) => void,
    connect:(color:colors,gameType:gameTypes,increment:number,setStart:React.Dispatch<React.SetStateAction<boolean>>) => void,
    disconnect:() => void
}

export const useGameState = create<gameState>((set) => ({
    gameType:null,
    color:null,
    gameIncrement:null,
    socket:null,
    gameState:gameStateType.noSocket,
    board:initBoard(),
    winner:null,
    pieceMoved:Pieces.NN,
    inMove:false,
    whiteTimeLeft:0,
    blackTimeLeft:0,
    whiteUserName:null,
    blackUserName:null,
    whoseChance:colors.White,
    timeUpdateInterval:null,
    startUpdatingTime:() => {
        const timeUpdateInterval = setInterval(updateTimeLeft,1000);
        set({timeUpdateInterval});
    },
    setWhoseChance:(color:colors) => set({whoseChance:color}),
    setWhiteUserName:(userName:string|null) => set({whiteUserName:userName}),
    setBlackUserName:(userName:string|null) => set({blackUserName:userName}),
    setWhiteTimeLeft:(timeLeft:number) => set({whiteTimeLeft:timeLeft}),
    setBlackTimeLeft:(timeLeft:number) => set({blackTimeLeft:timeLeft}),
    setGameState:(gameState:gameStateType) => set({gameState}),
    setGameType:(gameType:gameTypes) => set({gameType}),
    setColor:(color:color) => set({color}),
    setGameIncrement:(gameIncrement:number) => set({gameIncrement}),
    setSocket:(socket:WebSocket) => set({socket}),
    setBoard:(board:Board) => set({board}),
    setWinner:(color:color|null) => set({winner:color}),
    setPieceMoved:(piece:Pieces) => set({pieceMoved:piece}),
    setInMove:(inMove:boolean) => set({inMove}),
    disconnect:() => {
        set({gameState:gameStateType.noSocket,winner:null})
        useGameState.getState().socket?.close();
    },
    connect:(color:colors,gameType:gameTypes,increment:number,setStart:React.Dispatch<React.SetStateAction<boolean>>) => {
        const {disconnect,setWhiteTimeLeft ,setBlackTimeLeft } = useGameState.getState();
        disconnect();
        const socket = startGame(color,gameType,increment);
        socket.onopen = () => {
            set({color,gameType,gameIncrement:increment,socket:socket,gameState:gameStateType.waiting})
            setStart(true);
        }
        const {timeUpdateInterval} = useGameState.getState();
        if(timeUpdateInterval){
            clearInterval(timeUpdateInterval);
        }
        socket.onerror = (err) => {
            console.error("Error starting game",err);
            alert("Error starting game");
        }

        socket.onclose = () => {
            set({gameState:gameStateType.noSocket});
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
            const {color,inMove,pieceMoved,gameState,board,whoseChance,setInMove,setWinner,setGameState,setBoard,setColor,setWhiteUserName,setBlackUserName,setWhoseChance,startUpdatingTime} = useGameState.getState();
            const {userName} = useUserState.getState();
            // Handle starting of game
            if(gameState == gameStateType.waiting){
                data = data as startGameResponse;
                startUpdatingTime();
                if(data.start){
                    // Update the whole state
                    setGameState(gameStateType.running);
                    setColor(data.color);
                    // Update times and usernames
                    const time = getTimeFromGameType(gameType);
                    setWhiteTimeLeft(time);
                    setBlackTimeLeft(time);

                    if(color == colors.White){
                        setBlackUserName(data.opponentName)
                        setWhiteUserName(userName)
                    }
                    else{
                        setBlackUserName(userName);
                        setWhiteUserName(data.opponentName);
                    }
                }
            }
            else{
                data = data as moveSocketResponse;
                // Update the time left for both the players and chance
                setWhiteTimeLeft(data.whiteTimeLeft);
                setBlackTimeLeft(data.blackTimeLeft);
                setWhoseChance(oppositeColor(whoseChance));
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
                    console.log(data.move)
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

const updateTimeLeft = () => {
    const {whoseChance,whiteTimeLeft,blackTimeLeft,setWhiteTimeLeft,setBlackTimeLeft} = useGameState.getState();
    if(whoseChance == colors.White){
        setWhiteTimeLeft(whiteTimeLeft - 1000);
    }
    else{
        setBlackTimeLeft(blackTimeLeft - 1000);
    }
}
