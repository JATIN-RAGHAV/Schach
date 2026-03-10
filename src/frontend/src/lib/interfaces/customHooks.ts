import type { color, gameTypes } from "../../../../common/interfaces/enums";
import { gameState } from "@/pages/play/lib";

export interface gameStartState{
    gameType:gameTypes|null,
    gameState:gameState,
    color:color|null,
    gameIncrement:number|null,
    socket:WebSocket|null,
    setGameType:(gameType:gameTypes) => void,
    setColor:(color:color) => void,
    setGameIncrement:(gameIncrement:number) => void,
    setSocket:(socket:WebSocket) => void
}
