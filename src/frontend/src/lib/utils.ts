import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUserInfo } from "./network/user";
import { gameTypes } from "../../../common/interfaces/enums";
import { color as colors } from "../../../common/interfaces/enums";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// convert square index to key to store in state
export const squareIndexToKey = (row:number, col:number) => {
    return `${row}${col}`;
}

// convert square state key back to index to access the square
export const squareKeyToIndex = (key:string) => {
    const index = parseInt(key);
    return [Math.floor(index/10),index%10];
}

export const isUserLoggedIn = async () => {
    const user = await getUserInfo()
    return user!=null;
}

export const navigateBasedOnLogin = async (navigate:()=>void,when:boolean) => {
    if(await isUserLoggedIn() == when){
        navigate();
    }
}

export const getCellSize = () => {
    const windowWidth = window.innerWidth;
    let cellSize=0;
    if(windowWidth <= 500){
        cellSize = (windowWidth*0.9)/8;
    }
    else{
        cellSize = (windowWidth*0.4)/8;
    }
    return cellSize;
}

export const getTimeFromGameType = (gameType:gameTypes) => {
    let time = 10*60*1000; // default time is 10 minutes
    if(gameType === gameTypes.Bullet){
        time = 1*60*1000; // 1 minute
    }
    else if(gameType === gameTypes.Blitz){
        time = 3*60*1000; // 3 minutes
    }
    return time;
}

export const formatTime = (time:number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const oppositeColor = (color:colors) => {
    return color == colors.White ? colors.Black : colors.White;
}
