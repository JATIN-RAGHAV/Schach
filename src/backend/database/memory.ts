import {
    type userWaitingObject,
    type gameWaitingObject,
    type userIdWebSocket,
    type userOppo,
    type userQueue as userWaiting,
} from './interfaces';
import { color } from '../../common/interfaces/enums';
import { GameNotFound } from '../helper/errors';
import { getTimeKey } from './helper';
import type { ElysiaWS } from 'elysia/ws';

type Constructor<T extends object = object> =
// eslint-disable-next-line
new (...args: any[]) => T;
const Memory = <Tbase extends Constructor>(Base: Tbase) =>
    class extends Base {

        // Static Variables defined before hand
        // Maps color,time and increment to userWaitingObject
        static gameWaitingObjects: gameWaitingObject = {
            [color.Black]: {},
            [color.White]: {},
            [color.Random]: {},
        };
        // Set of users waiting for game to start
        static userWaitings: userWaiting = new Set<string>();
        // Maps opponents to each other
        static userOppo: userOppo = new Map();
        // Maps userId to socket
        static userIdWebSocket: userIdWebSocket = new Map();

        // Is there a game Object waiting with the give color, time and increment ??
        static isGameWaiting(color: color, time: number, increment: number): boolean {
            // key -> time:increment
            return getTimeKey(time, increment) in this.gameWaitingObjects[color];
        }

        // Set a game waiting object with the give color, time and increment
        static setGameWaitingObject(
            userId: string,
            userWaitingObject: userWaitingObject,
            color: color,
            time: number,
            increment: number,
        ): boolean {
            if (this.isUserWaiting(userId)) {
                return false;
            }
            const timeKey = getTimeKey(time, increment);
            this.gameWaitingObjects[color][timeKey] = userWaitingObject;
            this.userWaitings.add(userId);
            return true;
        }

        // Get a Game Object with the give color, time and increment
        static getGameWaitingObject(color: color, time: number, increment: number) {
            const timeKey = getTimeKey(time, increment);
            if (!this.isGameWaiting(color, time, increment)) {
                throw GameNotFound;
            }
            const gameWaitingObject = this.gameWaitingObjects[color][timeKey];
            if (gameWaitingObject != undefined) {
                let userId = gameWaitingObject.userId;
                this.userWaitings.delete(userId);
                this.removeGameWaitingObject(userId, color, time, increment);
                return gameWaitingObject;
            }
            throw GameNotFound;
        }

        // Remove a Game Object with the give color, time and increment
        static removeGameWaitingObject(
            userId: string,
            color: color,
            time: number,
            increment: number,
        ) {
            const timeKey = getTimeKey(time, increment);
            this.userWaitings.delete(userId);
            if (!this.isGameWaiting(color, time, increment)) {
                return;
            }
            const h = (this.gameWaitingObjects[color])
            delete h[timeKey];
        }

        static isUserWaiting(userId: string): boolean {
            return this.userWaitings.has(userId);
        }

        static getUserOppo(userId:string):(string|null){
            const res = this.userOppo.get(userId)
            if(res != undefined){
                return res
            }
            return null;
        }

        static isUserPlaying(userId:string):boolean{
            return this.userOppo.has(userId);
        }

        static setUserOppo(user1Id:string, user2Id:string):boolean{
            if(this.isUserPlaying(user1Id) || this.isUserPlaying(user2Id)){
                return false
            }
            this.userOppo.set(user1Id,user2Id)
            this.userOppo.set(user2Id,user1Id)
            return true
        }

        static removeUsersOppo(user1Id:string, user2Id:string):boolean{
            if(!this.isUserPlaying(user1Id) || !this.isUserPlaying(user2Id)){
                return false
            }
            this.userOppo.delete(user1Id)
            this.userOppo.delete(user2Id)
            return true
        }

        static getUserColor(userId:string):(color|null){
            const color = this.userIdWebSocket.get(userId)?.color;
            if(color != undefined){
                return color;
            }
            return null

        }

        static setUserIdSocket(userId:string, socket:ElysiaWS,color:color):boolean{
            if(this.userIdWebSocket.has(userId)){
                return false
            }

            this.userIdWebSocket.set(userId,{
                color,
                socket
            })
            return true
        }

        static getUserIdSocket(userId:string):(ElysiaWS|null){
            const socket = this.userIdWebSocket.get(userId)?.socket;
            if(socket != undefined){
                return socket;
            }
            return null
        }

        static removeUserIdSocket(userId:string){
            if(this.userIdWebSocket.has(userId)){
                this.userIdWebSocket.delete(userId)
            }
        }
    };

export default Memory;
