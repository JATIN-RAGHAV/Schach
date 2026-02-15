import Data from "../database/data";
import { runGame } from "../helper/gameLogic";
import { color as colorType } from "../../common/interfaces/enums";
import { getOpponent } from "../helper/getOpponent";
import { gameCreatePlugin } from "./plugins/gameApiPlugins";
import type { gameObject } from "../database/interfaces";

export const startGame = gameCreatePlugin
.ws('/game/create',{
        open(ws){
                const {username,userId,color,time,increment} = ws.data.user;

                const currentUserId = userId;
                let currentPlayer:gameObject = {
                        userId,
                        username,
                        ws
                }

                console.log(`User ${username} wants to play a Game as ${colorType[color]},time:${time},increment:${increment}.`)

                const opponentResponse = getOpponent(color,time,increment);
                if(opponentResponse){
                        let randCount = 0;
                        randCount += (color==colorType.Random?1:0);
                        randCount += (opponentResponse.color==colorType.Random?1:0);
                        
                        if(randCount == 0){
                                if(color == colorType.Black){
                                        const temp = currentPlayer
                                        currentPlayer = opponentResponse.oppo;
                                        opponentResponse.oppo = temp;
                                }
                        }
                        else if(randCount == 1){
                                if(color == colorType.Random ){
                                        if(opponentResponse.color == colorType.White){
                                                const temp = currentPlayer
                                                currentPlayer = opponentResponse.oppo;
                                                opponentResponse.oppo = temp;
                                        }
                                }
                                else if(color == colorType.Black){
                                                const temp = currentPlayer
                                                currentPlayer = opponentResponse.oppo;
                                                opponentResponse.oppo = temp;
                                }
                                
                        }
                        runGame(currentPlayer,opponentResponse.oppo,time,increment);
                }
                Data.addGame(currentUserId,currentPlayer,color,time,increment)
        },

        close(ws){
                const {username,userId,color,time,increment} = ws.data.user;
                Data.removeGame(userId,color,time,increment);
                console.log(`${username} has closed it's connection.`)
                ws.close()
        }
})
