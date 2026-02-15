import { color } from "../../common/interfaces/enums";
import type { gameObject } from "../database/interfaces"

export const runGame = (white: gameObject , black: gameObject ,time:number, increment:number) => {
        console.log(`Starting a game between ${white.username}(white) and ${black.username}(black).`)
        
        const whiteSocket = white.ws;
        const blackSocket = black.ws;
        const startTime = new Date();
        console.log(startTime)

        whiteSocket.send({
                start:true,
                color:color.White
        })
        blackSocket.send({
                start:true,
                color:color.Black
        })
        
        let chance = color.White;
}
