import { type GameList } from "./interfaces"
import { GameNotFound } from "../helper/errors";
type Constructor<T = {}> = new (...args: any[]) => T;
const Memory = <Tbase extends Constructor>(Base:Tbase) => class extends Base{

        static RapidGamesList:GameList[]=[];
        static BlitzGamesList:GameList[]=[];
        static BulletGamesList:GameList[]=[];

        static isRapidGame() {
                return this.RapidGamesList.length != 0;
        }

        static isBulletGame() {
                return this.RapidGamesList.length != 0;
        }

        static isBlitzGame() {
                return this.RapidGamesList.length != 0;
        }


        static addRapidGame(gl:GameList){
                console.log(`New connection started with ${gl.userId}`)
                this.RapidGamesList.push(gl)
        }

        static addBulletGame(gl:GameList){
                console.log(`New connection started with ${gl.userId}`)
                this.BulletGamesList.push(gl)
        }

        static addBlitzGame(gl:GameList){
                console.log(`New connection started with ${gl.userId}`)
                this.BlitzGamesList.push(gl)
        }


        static getRapidGame():GameList{
                if(this.RapidGamesList.length > 0){
                        const last = this.RapidGamesList.pop();
                        if(last != undefined){
                                return last
                        }
                }
                throw GameNotFound
        }

        static getBulletGame():GameList{
                if(this.BulletGamesList.length > 0){
                        const last = this.BulletGamesList.pop();
                        if(last != undefined){
                                return last
                        }
                }
                throw GameNotFound
        }

        static getBlitzGame():GameList{
                if(this.BlitzGamesList.length > 0){
                        const last = this.BlitzGamesList.pop();
                        if(last != undefined){
                                return last
                        }
                }
                throw GameNotFound
        }
}

export default Memory;
