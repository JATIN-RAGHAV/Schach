import Data from '../database/data';
import { color as colorType } from '../../common/interfaces/enums';
import { getOpponent } from '../helper/getOpponent';
import { gameCreatePlugin } from './plugins/gameApiPlugins';
import type { gameObject } from '../database/interfaces';

export const startGame = gameCreatePlugin.ws('/game/create', {
    open(ws) {
        // Get the current player Data
        const { username, userId, color, time, increment } = ws.data.user;
        const currentUserId = userId;
        const currentPlayer: gameObject = {
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
            let randCount = 0;
            randCount += color == colorType.Random ? 1 : 0;
            randCount += opponentResponse.color == colorType.Random ? 1 : 0;

            if (randCount == 0) {
                if (color == colorType.Black) {
                    blackSocket = currentPlayer.ws;
                    whiteSocket = opponentResponse.oppo.ws;
                }
            } else if (randCount == 1) {
                if (color == colorType.Random) {
                    if (opponentResponse.color == colorType.White) {
                        blackSocket = currentPlayer.ws;
                        whiteSocket = opponentResponse.oppo.ws;
                    }
                } else if (color == colorType.Black) {
                    blackSocket = currentPlayer.ws;
                    whiteSocket = opponentResponse.oppo.ws;
                }
            }

            console.log(
                `Starting a game between ${currentPlayer.username}(white) and ${opponentResponse.oppo.username}(black).`,
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
        Data.addGame(currentUserId, currentPlayer, color, time, increment);
    },

    message(ws, message) {
        console.log(message);
        console.log('message received');
        ws.send(message);
    },

    close(ws) {
        const { username, userId, color, time, increment } = ws.data.user;
        Data.removeGame(userId, color, time, increment);
        console.log(`${username} has closed it's connection.`);
        ws.close();
    },
});
