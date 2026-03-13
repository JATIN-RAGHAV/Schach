import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUserInfo } from "./network/user";

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
    let cellSize = 45;
    if(windowWidth <= 500){
        cellSize = (windowWidth*0.9)/8;
    }
    else{
        cellSize = (windowWidth*0.50)/8;
    }
    return cellSize;
}
