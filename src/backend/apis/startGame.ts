import Elysia from "elysia";
import Data from "../database/data";
import type { GameList } from "../database/interfaces";
import { type JWT_PAYLOAD } from "../interfaces/jwt_payload";
import { verify } from "../helper/jwt";

const App = new Elysia();

App
        .onBeforeHandle(async ({headers,status}) => {
                console.log("first")
                if(headers == undefined){
                console.log("second")
                        status(401)
                        return{
                                error:true,
                                message:"Bro didn't header, lol"
                        }
                }
                const token = headers['authorization']?.split(' ')[1]
                if(!token){
                console.log("third")
                        status(401)
                        return{
                                error:true,
                                message:"Auth Token not sent"
                        }
                }
                try{
                        console.log(token)
                        await verify(token)
                }
                catch (e) {
                        console.log("fourth")
                        status(401)
                        return {
                                error:true,
                                message:"Wrong token"
                        }
                }
        })
        .ws('/new/Rapid',{
                open(ws){
                        console.log("Got a connection")
                        const currentPlayer:GameList= {
                                ws:ws,
                                username:"user",
                                userId:"id"
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
                        console.log("Got a connection")
                        const currentPlayer:GameList= {
                                ws:ws,
                                username:"user",
                                userId:"id"
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
                        console.log("Got a connection")
                        const currentPlayer:GameList= {
                                ws:ws,
                                username:"user",
                                userId:"id"
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

export {
        App
}
