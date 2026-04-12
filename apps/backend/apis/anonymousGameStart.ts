import Data from '../database/data';
import { color as colorType } from '@schach/common/interfaces/enums';
import { getAnonymousOpponent } from '../helper/getOpponent';
import { anonymousGameStartPlugin } from './plugins/authPlugin';
import type { userWaitingObject } from '../database/interfaces';
import { isGameEnded, isMoveOk, printBoard, updateGameObject } from '@schach/common/game';
import type { ElysiaWS } from 'elysia/ws';
import { gameOverReasons, moveSocketRequestZod, type gameObject,  type moveSocketResponse ,startGameResponse} from '@schach/common/interfaces/game';
import { getResponsePostMove } from '../helper/game';
import Elysia from 'elysia';

export const anonymouseGameRun = new Elysia().use(anonymousGameStartPlugin)
.ws('/game/anonymous/run', {
    // Handle Connection starting
    async open(ws) {
        // Get the current player Data
        const { userId, color, time, increment } = ws.data.user;
        const currentUserId = userId;
        const username = "Anonymous"
        const currentPlayer: userWaitingObject= {
            userId,
            ws,
            username
        };

        console.log(
            `User ${username} wants to play a Game as ${colorType[color]},time:${time},increment:${increment}.`,
        );

        // Check if another player exists for the same kind of game with the right color
        const opponentResponse = getAnonymousOpponent(color, time, increment);
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

            // Remove the users from the game Queue
            Data.removeAnonymousGameWaitingObject(userId,color,time,increment);
            Data.removeAnonymousGameWaitingObject(opponentResponse.oppo.userId,color,time,increment);[]
            // Map userIds to their sockets to get when someone plays a move
            Data.setUserIdSocket(whiteUserId,whiteSocket,colorType.White)
            Data.setUserIdSocket(blackUserId,blackSocket,colorType.Black)
            // Set the users as opponents
            Data.setUserOppo(whiteUserId,blackUserId)
            // Add the game object to active games
            Data.setGameObject(whiteUserId,blackUserId,time);

            console.log(
                `Starting a game between ${whiteUsername}(white) and ${blackUsername}(black).`,
            );

            // Tell the users that their games has started
            const whiteStartResponse: startGameResponse = {
                start: true,
                color: colorType.White,
                opponentName: blackUsername,
            }
            const blackStartResponse: startGameResponse = {
                start: true,
                color: colorType.Black,
                opponentName: whiteUsername,
            }
            whiteSocket.send(whiteStartResponse);
            blackSocket.send(blackStartResponse);
            return;
        }
        console.log(`Adding user ${username} to the queue.`);
        Data.setAnonymousGameWaitingObject(currentUserId, currentPlayer, color, time, increment);
    },

    // Handle incoming moves
    async message (ws, message:moveSocketResponse) {
        // Get user data and check if the user is playing
        const moveTime = Date.now();
        const {userId,increment,time} = ws.data.user;
        const username = "Anonymous"
        const color = Data.getPlayerColor(userId);
        if(!Data.isUserPlaying(userId)){
            const res:moveSocketResponse = {
                error:true,
                message:"Game has not started yet",
            }
            ws.send(res)
            return;
        }

        // Validate Move format
        const res = moveSocketRequestZod.safeParse(message);
        if(!res.success){
            const res:moveSocketResponse = {
                error:true,
                message:"Invalid Move format",
            }
            ws.send(res)
            return;
        }
        const {move}= res.data;

        // Get Opponent data
        const oppoUserId = Data.getUserOppo(userId)as string;
        const oppoSocket = Data.getUserIdSocket(oppoUserId) as ElysiaWS;

        // Get white player id and black player id
        let whiteUserId = userId;
        let blackUserId = oppoUserId;
        if(color == colorType.Black){
            [whiteUserId, blackUserId] = [blackUserId, whiteUserId];
        }

        // Get the gameObject and the inner parts
        const gameObject = Data.getGameObject(whiteUserId,blackUserId) as gameObject;
        let {board,moveNumber,specialMoveFlags} = gameObject;

        // move number initially == 0, so even moves are white and odd are black
        const currentColor = (moveNumber%2)===1?colorType.Black:colorType.White;

        // Validate the move
        const isPlayersMove = currentColor == color;
        const isValidMove = isMoveOk(board,move,color,specialMoveFlags);
        if(!isPlayersMove || !isValidMove){
            const responseObject:moveSocketResponse = {
                error:true,
                message:"Invalid move",
            }
            ws.send(responseObject)
            return;
        }

        // Update the game object
        updateGameObject(gameObject,moveTime,move,color,increment);

        // Check if the game has ended or not
        const gameState = isGameEnded(gameObject,color);
        const {oppoPlayerResponse,currentPlayerResponse} = getResponsePostMove(gameState,gameObject,move);
        oppoSocket.send(oppoPlayerResponse)
        ws.send(currentPlayerResponse)

        // log
        console.log(`move made by ${username} move; ${move} `)
        printBoard(board)

        // End game or not
        if(gameState.over){
            console.log(`Game over Reason: ${gameOverReasons[gameState.gameEndReason]}`)
            // Remove the game from active games
            Data.endGame(whiteUserId,blackUserId);
            // Close websockets
            ws.close();
            oppoSocket.close();
        }
    },

    // Handle connection closing
    close(ws) {
        const { userId,  time, increment } = ws.data.user;
        const username = "Anonymous";
        let {color} = ws.data.user;
        // If the user was in the queue
        if(Data.isUserWaiting(userId)){
            Data.removeAnonymousGameWaitingObject(userId, color, time, increment);
            console.log(`${username} has closed it's connection from the Queue`);
        }

        // If the user was in a game
        if(Data.isUserPlaying(userId)){
            const oppoId = Data.getUserOppo(userId)
            // If the other player left
            if(oppoId){
                console.log(`Opponent left`)
                const oppoSocket = Data.getUserIdSocket(oppoId) as ElysiaWS;
                const responseObject:moveSocketResponse = {
                    winner:true,
                    error:false,
                    over:true,
                    whyOver:gameOverReasons.otherAbandoned,
                    message:"You won, the other person left.",
                }
                // Tell them that they have won
                oppoSocket.send(responseObject)
                // Prepare to end game
                // Get game Object before hand and remove the game Object from active games
                //  Remove from active games -> close oppo connection
                const color = Data.getPlayerColor(userId);
                let whiteUserId = userId;
                let blackUserId = oppoId;
                if(color == colorType.Black){
                    [whiteUserId, blackUserId] = [blackUserId, whiteUserId];
                }
                // Remove game from active games
                Data.endGame(whiteUserId,blackUserId);
                oppoSocket.close();
            }
            console.log(`${username} closed connection midgame as ${colorType[color]} and ${oppoId} has won the game`)
        }
        ws.close();
    },
});
