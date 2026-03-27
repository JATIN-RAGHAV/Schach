import {
    type gameQueueObject,
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

        // Data structures to store data related to anonymous users
        static AnonymousGameQueue: gameObjectQueue = {
            [color.Black]: {},
            [color.White]: {},
            [color.Random]: {},
        };
        static anonymousUserQueue: userQueue = new Set<string>();
        static anonymousUserOppo: userOppo = new Map();
        static anonymousUserIdWebSocket: userIdWebSocket = new Map();

        static isGameQueue(color: color, time: number, increment: number,isAnonymous: boolean): boolean {
            // key -> time:increment
            if(isAnonymous){
                return getTimeKey(time, increment) in this.AnonymousGameQueue[color];
            }
            else{
                return getTimeKey(time, increment) in this.gameQueue[color];
            }
        }

        static addGameQueue(
            userId: string,
            gameQueueObject: gameQueueObject,
            color: color,
            time: number,
            increment: number,
            isAnonymous: boolean
        ): boolean {
            if (this.isUserQueue(userId,isAnonymous)) {
                return false;
            }
            const timeKey = getTimeKey(time, increment);
            if(isAnonymous){
                if (!(timeKey in this.AnonymousGameQueue[color])) {
                    this.AnonymousGameQueue[color][timeKey] = new Map<string, gameQueueObject>();
                }
                this.AnonymousGameQueue[color][timeKey]?.set(userId, gameQueueObject);
                this.anonymousUserQueue.add(userId);
                return true
            }
            if (!(timeKey in this.gameQueue[color])) {
                this.gameQueue[color][timeKey] = new Map<string, gameQueueObject>();
            }
            this.gameQueue[color][timeKey]?.set(userId, gameQueueObject);
            this.userQueue.add(userId);
            return true;
        }

        static getGameQueue(color: color, time: number, increment: number,isAnonymouse:boolean) {
            const timeKey = getTimeKey(time, increment);
            if (!this.isGameQueue(color, time, increment,isAnonymouse)) {
                throw GameNotFound;
            }

            if(isAnonymouse){
                const gameQueueObjectMap = this.AnonymousGameQueue[color][timeKey];
                if (gameQueueObjectMap != undefined) {
                    let userId = gameQueueObjectMap.keys().next().value;
                    userId = userId != undefined ? userId : 'shit';
                    const gameQueueObject = gameQueueObjectMap.get(userId);
                    this.anonymousUserQueue.delete(userId);
                    this.removeGameQueue(userId, color, time, increment,isAnonymouse);
                    return gameQueueObject;
                }
            }
            const gameQueueObjectMap = this.gameQueue[color][timeKey];
            if (gameQueueObjectMap != undefined) {
                let userId = gameQueueObjectMap.keys().next().value;
                userId = userId != undefined ? userId : 'shit';
                const gameQueueObject = gameQueueObjectMap.get(userId);
                this.userQueue.delete(userId);
                this.removeGameQueue(userId, color, time, increment,isAnonymouse);
                return gameQueueObject;
            }
            throw GameNotFound;
        }

        static removeGameQueue(
            userId: string,
            color: color,
            time: number,
            increment: number,
            isAnonymouse: boolean
        ) {
            const timeKey = getTimeKey(time, increment);
            if(isAnonymouse){
                this.anonymousUserQueue.delete(userId);
            }
            else{
                this.userQueue.delete(userId);
            }
            if (!this.isGameQueue(color, time, increment,isAnonymouse)) {
                return;
            }
            if(isAnonymouse){
                if (this.AnonymousGameQueue[color][timeKey]?.has(userId)) {
                    this.AnonymousGameQueue[color][timeKey].delete(userId);
                }
            }
            else{
                if (this.gameQueue[color][timeKey]?.has(userId)) {
                    this.gameQueue[color][timeKey].delete(userId);
                }
            }
        }

        static isUserQueue(userId: string,isAnonymous: boolean): boolean {
            if(isAnonymous){
                return this.anonymousUserQueue.has(userId);
            }
            else{
                return this.userQueue.has(userId);
            }
        }

        static print() {
            console.log(this.gameQueue);
        }

        static getUserOppo(userId:string,isAnonymous: boolean):(string|null){
            if(isAnonymous){
                const res = this.anonymousUserOppo.get(userId)
                if(res != undefined){
                    return res
                }
            }
            else{
                const res = this.userOppo.get(userId)
                if(res != undefined){
                    return res
                }
            }
            return null;
        }

        static isUserPlaying(userId:string,isAnonymous: boolean):boolean{
            if(isAnonymous){
                return this.anonymousUserOppo.has(userId);
            }
            else{
                return this.userOppo.has(userId);
            }
        }

        static setUserOppo(user1Id:string, user2Id:string,isAnonymous:boolean):boolean{
            if(this.isUserPlaying(user1Id,isAnonymous) || this.isUserPlaying(user2Id,isAnonymous)){
                return false
            }
            if(isAnonymous){
                this.anonymousUserOppo.set(user1Id,user2Id)
                this.anonymousUserOppo.set(user2Id,user1Id)
                return true
            }
            this.userOppo.set(user1Id,user2Id)
            this.userOppo.set(user2Id,user1Id)
            return true
        }

        static removeUsersOppo(user1Id:string, user2Id:string,isAnonymous: boolean):boolean{
            if(!this.isUserPlaying(user1Id,isAnonymous) || !this.isUserPlaying(user2Id,isAnonymous)){
                return false
            }
            if(isAnonymous){
                this.anonymousUserOppo.delete(user1Id)
                this.anonymousUserOppo.delete(user2Id)
                return true
            }
            this.userOppo.delete(user1Id)
            this.userOppo.delete(user2Id)
            return true
        }

        static getUserColor(userId:string,isAnonymous:boolean):(color|null){
            if(isAnonymous){
                const color = this.anonymousUserIdWebSocket.get(userId)?.color;
                if(color != undefined){
                    return color;
                }
            }
            else{
                const color = this.userIdWebSocket.get(userId)?.color;
                if(color != undefined){
                    return color;
                }
            }
            return null
        }

        static setUserIdSocket(userId:string, socket:ElysiaWS,color:color,isAnonymous: boolean):boolean{
            if(isAnonymous){
                if(this.anonymousUserIdWebSocket.has(userId)){
                    return false
                }
                this.anonymousUserIdWebSocket.set(userId,{
                    color,
                    socket
                })
            }
            else{
                if(this.userIdWebSocket.has(userId)){
                    return false
                }
                this.userIdWebSocket.set(userId,{
                    color,
                    socket
                })
            }

            return true
        }

        static getUserIdSocket(userId:string,isAnonymous: boolean):(ElysiaWS|null){
            if(isAnonymous){
                const socket = this.anonymousUserIdWebSocket.get(userId)?.socket;
                if(socket != undefined){
                    return socket;
                }
            }
            const socket = this.userIdWebSocket.get(userId)?.socket;
            if(socket != undefined){
                return socket;
            }
            return null
        }

        static removeUserIdSocket(userId:string,isAnonymous:boolean){
            if(this.userIdWebSocket.has(userId)){
                if(isAnonymous){
                    this.anonymousUserIdWebSocket.delete(userId)
                }
                else{
                    this.userIdWebSocket.delete(userId)
                }
            }
        }
    };

export default Memory;
