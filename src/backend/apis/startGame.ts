import Data from "../database/data";
import type { GameList } from "../database/interfaces";
import authPlugin from "./middlewares";

export const startGame = authPlugin
.ws('/new/Rapid',{
        open(ws){
                console.log(`User ${ws.data.user?.username} wants to play a Rapid Game.`)
                const currentPlayer:GameList= {
                        ws:ws,
                        username:ws.data.user?.username ? ws.data.user.username:"user",
                        userId:ws.data.user?.userId ? ws.data.user.userId : "id"
                }

                if(Data.isRapidGame()){
                        const otherPlayer = Data.getRapidGame();
                        console.log(`Started a new Game between ${otherPlayer.userId} & ${currentPlayer.userId}`)
                        // playRapidGame(currentPlayer,otherPlayer)
                        return
                }

                Data.addRapidGame(currentPlayer)
        }
})
.ws('/new/Blitz',{
        open(ws){
                console.log(`User ${ws.data.user?.username} wants to play a Blits Game.`)
                const currentPlayer:GameList= {
                        ws:ws,
                        username:ws.data.user?.username ? ws.data.user.username:"user",
                        userId:ws.data.user?.userId ? ws.data.user.userId : "id"
                }

                if(Data.isBlitzGame()){
                        const otherPlayer = Data.getBlitzGame();
                        console.log(`Started a new Game between ${otherPlayer.userId} & ${currentPlayer.userId}`)
                        // playBlitzGame(currentPlayer,otherPlayer)
                        return
                }

                Data.addBlitzGame(currentPlayer)
        }
})

.ws('/new/Bullet',{
        open(ws){
                console.log(`User ${ws.data.user?.username} wants to play a Bullet Game.`)
                const currentPlayer:GameList= {
                        ws:ws,
                        username:ws.data.user?.username ? ws.data.user.username:"user",
                        userId:ws.data.user?.userId ? ws.data.user.userId : "id"
                }

                if(Data.isBulletGame()){
                        const otherPlayer = Data.getBulletGame();
                        // playBulletGame(currentPlayer,otherPlayer)
                        console.log(`Started a new Game between ${otherPlayer.userId} & ${currentPlayer.userId}`)
                        return
                }

                Data.addBulletGame(currentPlayer)
        }
})
