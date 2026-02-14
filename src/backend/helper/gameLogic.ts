import type { userGameObject } from "../database/interfaces"

export const runGame = (white: userGameObject, black: userGameObject,time:number, increment:number) => {
        console.log(`Starting a game between ${white.username}(white) and ${black.username}(black).`)

}
