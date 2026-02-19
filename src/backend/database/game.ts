import { initBoard } from "../../common/game";
import type { gameObject } from "../../common/interfaces/game";

type Constructor<T extends object = object> =
// eslint-disable-next-line
new (...args: any[]) => T;
const Game = <Tbase extends Constructor>(Base: Tbase) =>
    class extends Base {
        // Define the static variables
        static gamesList:Map<string,gameObject>=new Map<string,gameObject>();

        // Get the key for a pair of users
        static getKey(whiteUserId:string, blackUserId:string){
            return whiteUserId+':'+blackUserId;
        }

        // Get the game object give the user Ids
        static getGameObject(whiteUserId:string, blackuserId:string){
            const key = this.getKey(whiteUserId,blackuserId);
            return this.gamesList.get(key)
        }

        // Initalise a gameObject and add it to the gamesList
        static setGameObject(whiteUserId:string, blackUserId:string,time:number){
            const board = initBoard();
            const startTime = new Date();
            const key = this.getKey(whiteUserId,blackUserId);

            //moveNumber, movesTimes, whiteTimeLeft, blackTimeLeft 
            this.gamesList.set(key,{
                board,
                startTime,
                moves:new Array<string>(),
                moveNumber:0,
                movesTimes:[0],
                whiteTimeLeft:time,
                specialMoveFlags:0,
                blackTimeLeft:time,
            })
        }
    };

export default Game;
