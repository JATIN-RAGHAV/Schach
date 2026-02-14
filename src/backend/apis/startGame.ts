import Data from "../database/data";
import { type userGameObject } from "../database/interfaces";
import { runGame } from "../helper/gameLogic";
import authPlugin from "./middlewares";
import { createGameZod } from "../../common/interfaces/gameZodTypes";
import {type createGame } from "../interfaces/game";
import { color as colorType } from "../../common/interfaces/enums";
import { getOpponent } from "../helper/getOpponent";

export const startGame = authPlugin
.ws('/game/create',{
        open(ws){
                let currentPlayer:userGameObject= {
                        ws:ws,
                        username:ws.data.user?.username ? ws.data.user.username:"user",
                        userId:ws.data.user?.userId ? ws.data.user.userId : "id"
                }

                const res = createGameZod.safeParse(ws.data.headers)
                if(!res.success){
                        ws.send({
                                error:true,
                                message:"Please send the correct params.",
                                expected:{
                                        params:{
                                                color:"color",
                                                time:"number",
                                                increment:"number"
                                        }
                                }
                        })
                        ws.close();
                        return
                }
                let {color,time,increment} = (res.data as createGame);
                let colorEnum = color as colorType;
                if(color >=3 && color<0){
                        ws.send({
                                error:true,
                                message:"Bro what color u choosing, get the right one.",
                                expected:{
                                        params:{
                                                color:"color",
                                                time:"number",
                                                increment:"number"
                                        }
                                }
                        })
                }

                console.log(`User ${ws.data.user?.username} wants to play a Game as ${colorType[colorEnum]},time:${time},increment:${increment}.`)

                const opponentResponse = getOpponent(colorEnum,time,increment);
                if(opponentResponse){
                        let randCount = 0;
                        randCount += (colorEnum==colorType.Random?1:0);
                        randCount += (opponentResponse.color==colorType.Random?1:0);
                        
                        if(randCount == 0){
                                if(colorEnum == colorType.Black){
                                        const temp = currentPlayer
                                        currentPlayer = opponentResponse.oppo;
                                        opponentResponse.oppo = temp;
                                }
                        }
                        else if(randCount == 1){
                                if(colorEnum == colorType.Random ){
                                        if(opponentResponse.color == colorType.White){
                                                const temp = currentPlayer
                                                currentPlayer = opponentResponse.oppo;
                                                opponentResponse.oppo = temp;
                                        }
                                }
                                else if(colorEnum == colorType.Black){
                                                const temp = currentPlayer
                                                currentPlayer = opponentResponse.oppo;
                                                opponentResponse.oppo = temp;
                                }
                                
                        }
                        runGame(currentPlayer,opponentResponse.oppo,time,increment);
                }
                Data.addGame(currentPlayer,colorEnum,time,increment)
        }
})
