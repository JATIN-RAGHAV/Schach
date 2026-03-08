import type { color, gameTypes } from "../../../../common/interfaces/enums";

export interface gameStartState{
    gameType:gameTypes|null,
    color:color|null,
    gameIncrement:number|null,
    socket:WebSocket|null,
    setGameType:(gameType:gameTypes) => void,
    setColor:(color:color) => void,
    setGameIncrement:(gameIncrement:number) => void,
    setSocket:(socket:WebSocket) => void
}
