import { create } from "zustand";
import { color, Pieces } from "../../../../common/interfaces/enums";

export interface onMessageHandlerState{
    winner:color|null,
    pieceMoved:Pieces,
    inMove:boolean,
    setWinner:(color:color|null) => void,
    setPieceMoved:(piece:Pieces) => void,
    setInMove:(inMove:boolean) => void
}

export const useOnMessageHandlerState = create<onMessageHandlerState>((set) => ({
    winner:null,
    pieceMoved:Pieces.NN,
    inMove:false,
    setWinner:(color:color|null) => set({winner:color}),
    setPieceMoved:(piece:Pieces) => set({pieceMoved:piece}),
    setInMove:(inMove:boolean) => set({inMove})
}))
