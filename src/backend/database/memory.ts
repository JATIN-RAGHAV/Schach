import {
    type gameObject,
    type gameObjectQueue,
    type userIdWebSocket,
    type userOppo,
    type userQueue,
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
        static gameQueue: gameObjectQueue = {
            [color.Black]: {},
            [color.White]: {},
            [color.Random]: {},
        };
        static userQueue: userQueue = new Set<string>();
        static userOppo: userOppo = new Map();
        static userIdWebSocket: userIdWebSocket = new Map();

        static isGame(color: color, time: number, increment: number): boolean {
            // key -> time:increment
            return getTimeKey(time, increment) in this.gameQueue[color];
        }

        static addGame(
            userId: string,
            gameObject: gameObject,
            color: color,
            time: number,
            increment: number,
        ): boolean {
            if (this.isUserQueue(userId)) {
                return false;
            }
            const timeKey = getTimeKey(time, increment);
            if (!(timeKey in this.gameQueue[color])) {
                this.gameQueue[color][timeKey] = new Map<string, gameObject>();
            }
            this.gameQueue[color][timeKey]?.set(userId, gameObject);
            this.userQueue.add(userId);
            return true;
        }

        static getGame(color: color, time: number, increment: number) {
            const timeKey = getTimeKey(time, increment);
            if (!this.isGame(color, time, increment)) {
                throw GameNotFound;
            }
            const gameObjectMap = this.gameQueue[color][timeKey];
            if (gameObjectMap != undefined) {
                let userId = gameObjectMap.keys().next().value;
                userId = userId != undefined ? userId : 'shit';
                const gameObject = gameObjectMap.get(userId);
                this.userQueue.delete(userId);
                this.removeGameQueue(userId, color, time, increment);
                return gameObject;
            }
            throw GameNotFound;
        }

        static removeGameQueue(
            userId: string,
            color: color,
            time: number,
            increment: number,
        ) {
            const timeKey = getTimeKey(time, increment);
            this.userQueue.delete(userId);
            if (!this.isGame(color, time, increment)) {
                return;
            }
            if (this.gameQueue[color][timeKey]?.has(userId)) {
                this.gameQueue[color][timeKey].delete(userId);
            }
        }

        static isUserQueue(userId: string): boolean {
            return this.userQueue.has(userId);
        }

        static print() {
            console.log(this.gameQueue);
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
