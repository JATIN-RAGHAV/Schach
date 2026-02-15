import { type gameObject, type gameObjectQueue, type userQueue } from "./interfaces"
import { color } from "../../common/interfaces/enums";
import { GameNotFound } from "../helper/errors";
import { getTimeKey } from "./helper";
type Constructor<T = {}> = new (...args: any[]) => T;
const Memory = <Tbase extends Constructor>(Base:Tbase) => class extends Base{

        static gameQueue: gameObjectQueue={
                [color.Black]:{},
                [color.White]:{},
                [color.Random]:{},
        };
        static userQueue:userQueue = new Set<string>();

        static isGame(color:color, time:number,increment:number):boolean { // key -> time:increment
                return  getTimeKey(time,increment) in this.gameQueue[color]
        }

        static addGame(userId:string, gameObject:gameObject, color:color, time:number, increment:number):boolean{
                if(this.isUser(userId)){
                        return false
                }
                const timeKey = getTimeKey(time,increment)
                if(!(timeKey in this.gameQueue[color])){
                        this.gameQueue[color][timeKey] = new Map<string,gameObject>();
                }
                this.gameQueue[color][timeKey]?.set(userId,gameObject);
                this.userQueue.add(userId)
                return true;
        }

        static getGame(color:color, time:number, increment:number){
                const timeKey = getTimeKey(time,increment)
                if(!this.isGame(color,time,increment)){
                        throw GameNotFound
                }
                const gameObjectMap = this.gameQueue[color][timeKey];
                if(gameObjectMap != undefined){
                        let userId = gameObjectMap.keys().next().value;
                        userId = userId!=undefined?userId:"shit";
                        const gameObject = gameObjectMap.get(userId);
                        this.userQueue.delete(userId)
                        this.removeGame(userId,color,time,increment);
                        return gameObject;
                }
                throw GameNotFound
        }

        static removeGame(userId:string, color:color,time:number,increment:number){
                const timeKey = getTimeKey(time,increment)
                this.userQueue.delete(userId)
                if(!this.isGame(color,time,increment)){
                        return
                }
                if(this.gameQueue[color][timeKey]?.has(userId)){
                        this.gameQueue[color][timeKey].delete(userId);
                }
        }

        static isUser(userId:string):boolean{
                return this.userQueue.has(userId);
        }

        static print(){
                console.log(this.gameQueue)
        }
}

export default Memory;
