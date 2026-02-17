import Data from '../database/data';
import { color as colorType } from '../../common/interfaces/enums';
import { getOpponent } from '../helper/getOpponent';
import { gameCreatePlugin } from './plugins/gameApiPlugins';
import type { gameQueueObject } from '../database/interfaces';

export const gameRun = gameCreatePlugin.ws('/game/run', {
    // Handle Connection starting
    open(ws) {
        console.log("hi")
        // Get the current player Data
        const { username, userId, color, time, increment } = ws.data.user;
        const currentUserId = userId;
        const currentPlayer: gameQueueObject= {
            userId,
            username,
            ws,
        };

        console.log(
            `User ${username} wants to play a Game as ${colorType[color]},time:${time},increment:${increment}.`,
        );

        // Check if another player exists for the same kind of game with the right color
        const opponentResponse = getOpponent(color, time, increment);
        if (opponentResponse) {
            // Decide who is going to play as white and who is going to play as black
            let whiteSocket = currentPlayer.ws;
            let blackSocket = opponentResponse.oppo.ws;
            let whiteUsername = currentPlayer.username;
            let blackUsername = opponentResponse.oppo.username;
            let whiteUserId = userId;
            let blackUserId = opponentResponse.oppo.userId
            let randCount = 0;
            randCount += color == colorType.Random ? 1 : 0;
            randCount += opponentResponse.color == colorType.Random ? 1 : 0;

            if (randCount == 0) {
                if (color == colorType.Black) {
                    [blackSocket, whiteSocket] = [whiteSocket, blackSocket];
                    [blackUsername,whiteUsername] = [whiteUsername,blackUsername];
                    [blackUserId, whiteUserId] = [whiteUserId, blackUserId];
                }
            } else if (randCount == 1) {
                if (color == colorType.Random) {
                    if (opponentResponse.color == colorType.White) {
                    [blackSocket, whiteSocket] = [whiteSocket, blackSocket];
                    [blackUsername,whiteUsername] = [whiteUsername,blackUsername];
                    [blackUserId, whiteUserId] = [whiteUserId, blackUserId];
                    }
                } else if (color == colorType.Black) {
                    [blackSocket, whiteSocket] = [whiteSocket, blackSocket];
                    [blackUsername,whiteUsername] = [whiteUsername,blackUsername];
                    [blackUserId, whiteUserId] = [whiteUserId, blackUserId];
                }
            }

            Data.removeGameQueue(userId,color,time,increment);
            Data.removeGameQueue(opponentResponse.oppo.userId,color,time,increment);[]
            Data.setUserIdSocket(whiteUserId,whiteSocket,colorType.White)
            Data.setUserIdSocket(blackUserId,blackSocket,colorType.Black)
            Data.setUserOppo(whiteUserId,blackUserId)
            console.log(
                `Starting a game between ${whiteUsername}(white) and ${blackUsername}(black).`,
            );
            const startTime = new Date();
            console.log(startTime);
            whiteSocket.send({
                start: true,
                color: colorType.White,
            });
            blackSocket.send({
                start: true,
                color: colorType.Black,
            });
            return;
        }
        Data.addGameQueue(currentUserId, currentPlayer, color, time, increment);
    },

    // Handle incoming moves
    message(ws, message) {
        console.log(`move: ${message}`)
        ws.send("move received")
    },

    // Handle connection closing
    close(ws) {
        const { username, userId,  time, increment } = ws.data.user;
        let {color} = ws.data.user;
        // If the user was in the queue
        if(Data.isUserQueue(userId)){
            Data.removeGameQueue(userId, color, time, increment);
            console.log(`${username} has closed it's connection from the Queue`);
        }

        // If the user was in a game
        if(Data.isUserPlaying(userId)){
            const oppoId = Data.getUserOppo(userId)
            if(oppoId){
                const oppoSocket = Data.getUserIdSocket(oppoId);
                if(oppoSocket){
                    // Tell them that they have won
                    oppoSocket.send({
                        ended:true,
                        winner:true
                    })
                    color = Data.getUserColor(userId) || color
                    Data.removeUserIdSocket(oppoId);
                    Data.removeUserIdSocket(userId)
                    Data.removeUsersOppo(userId,oppoId)
                    oppoSocket.close();
                }
            }
                    console.log(`${username} closed connection midgame as ${colorType[color]} and ${oppoId} has won the game`)
        }
        ws.close();
    },
});
