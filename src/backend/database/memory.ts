import { type gameQueueObject, type userGameObject } from "./interfaces"
import { color } from "../../common/interfaces/enums";
import { GameNotFound } from "../helper/errors";
import { getTimeKey } from "./helper";
type Constructor<T = {}> = new (...args: any[]) => T;
const Memory = <Tbase extends Constructor>(Base:Tbase) => class extends Base{

        static gameQueue: gameQueueObject={
                [color.Black]:{},
                [color.White]:{},
                [color.Random]:{},
        };

        static isGame(color:color, time:number,increment:number):boolean { // key -> time:increment
                return  getTimeKey(time,increment) in this.gameQueue[color]
        }

        static addGame(gameObject:userGameObject, color:color, time:number, increment:number):void{
                const timeKey = getTimeKey(time,increment)
                if(!(timeKey in this.gameQueue[color])){
                        this.gameQueue[color][timeKey] = [];
                }
                this.gameQueue[color][timeKey]?.push(gameObject);
        }

        static getGame(color:color, time:number, increment:number){
                const timeKey = getTimeKey(time,increment)
                if(!this.isGame(color,time,increment)){
                        throw GameNotFound
                }
                return this.gameQueue[color][timeKey]?.pop();
        }

        static print(){
                console.log(this.gameQueue)
        }
}

export default Memory;
