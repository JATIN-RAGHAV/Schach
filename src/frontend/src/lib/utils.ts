import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
