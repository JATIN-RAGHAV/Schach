import {color as colors, gameTypes } from "@/../../common/interfaces/enums";
import { getTimeFromGameType } from "../utils";

// Get the base url to make the request
const baseUrl = import.meta.env.VITE_BASE_API_URL

// Returns an object with the error status and the ws connection if successful
export const startGame = (color:colors,gameType:gameTypes,increment:number)=>{
    const time = getTimeFromGameType(gameType)
    const token = localStorage.getItem('token');
    const url = "ws://" + baseUrl + "/game/run";
    const route = `${url}?authorization=Bearer ${token}&color=${color}&time=${time}&increment=${increment}`;

    // Start a ws connection with the server at the given route
    const ws = new WebSocket(route);
    return ws;
}
