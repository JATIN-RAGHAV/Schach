import Data from '../database/data';
import { color as colorType, Pieces, specialFlags } from '../../common/interfaces/enums';
import { getOpponent } from '../helper/getOpponent';
import { gameCreatePlugin } from './plugins/gameApiPlugins';
import type { gameQueueObject } from '../database/interfaces';
import { initBoard, isMoveOk, makeMove, moveCharsToIndex, printBoard, updateGameObject } from '../../common/game';
import type { ElysiaWS } from 'elysia/ws';
import { moveSocketRequest, type gameObject, type moveIndex, type moveSocketResponse, type Row } from '../../common/interfaces/game';

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

            // remove the users from the game Queue
            Data.removeGameQueue(userId,color,time,increment);
            Data.removeGameQueue(opponentResponse.oppo.userId,color,time,increment);[]
            Data.setUserIdSocket(whiteUserId,whiteSocket,colorType.White)
            Data.setUserIdSocket(blackUserId,blackSocket,colorType.Black)
            Data.setUserOppo(whiteUserId,blackUserId)
            // Add the game object to active games
            Data.setGameObject(whiteUserId,blackUserId,time);

            console.log(
                `Starting a game between ${whiteUsername}(white) and ${blackUsername}(black).`,
            );
            
            // Tell the users that their games has started
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
    async message (ws, message) {
        // Get user data and check if the user is playing
        const currentTime = Date.now();
        const {userId,username,increment} = ws.data.user;
        const color = Data.getPlayerColor(userId);
        console.log(`${username} wants to make a move`)
        if(!Data.isUserPlaying(userId)){
            ws.send({
                error:true,
                accepted:false,
                message:"You arn't even playing bro."

            })
            return;
        }

        // Validate Move format
        const res = moveSocketRequest.safeParse(message);
        if(!res.success){
            ws.send({
                error:true,
                accepted:false,
                message:res.error?.message
            })
            return;
        }
        console.log("valid zod move")
        const move = res.data;

        console.log(move)
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
        let {board,moveNumber,moves,specialMoveFlags} = gameObject;

        console.log(`Got game object`)
        
        // move number initially == 0, so even moves are white and odd are black
        const currentColor = (moveNumber%2)===1?colorType.Black:colorType.White;
        
        // Validate the move
        const isPlayersMove = currentColor == color;
        const isValidMove = isMoveOk(board,move,color,specialMoveFlags,(moves[moves.length-1]||""));
        if(!isPlayersMove || !isValidMove){
            const responseObject:moveSocketResponse = {
                moveColor:color,
                move:move,
                winner:false,
                error:true,
                over:false,
                message:"Play a valid move",
            }
            ws.send(responseObject)
            console.log(`invalid move sent my player ${username}.`)
            printBoard(board);
            return;
        }
        console.log(`move was validated`)
        printBoard(board)

        // Update the game object
        updateGameObject(gameObject,currentTime,move,color,increment);
        console.log(`gaem object updated`)

        // Inform the other player that a move is made
        const responseObject:moveSocketResponse = {
            moveColor:color,
            move:move,
            winner:false,
            error:false,
            over:false,
            message:"Play a valid move",
        }
        oppoSocket.send(responseObject)
        console.log(`other player informmed`)
        // Inform the current player that the move was accepted
        ws.send(responseObject)

        console.log(`move made by ${username} move; ${move} `)
        printBoard(board)
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
                    const responseObject:moveSocketResponse = {
                        moveColor:color,
                        move:"",
                        winner:true,
                        error:false,
                        over:true,
                        message:"You won, the other person left."
                    }
                    oppoSocket.send(responseObject)
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
