import { getInitialGameObject } from "../../common/game";
import { color } from "../../common/interfaces/enums";
import type { gameObject } from "../../common/interfaces/game";
import Data from "./data";

type Constructor<T extends object = object> =
// eslint-disable-next-line
new (...args: any[]) => T;
const Game = <Tbase extends Constructor>(Base: Tbase) =>
    class extends Base {
        // Define the static variables
        // To map username keys onto the game object
        static gamesList:Map<string,gameObject>=new Map<string,gameObject>();
        // To map userId with their color
        static playerColor:Map<string,color>=new Map<string,color>();

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
            const key = Data.getKey(whiteUserId,blackUserId);

            // Set user colors
            this.playerColor.set(blackUserId,color.Black);
            this.playerColor.set(whiteUserId,color.White);

            //moveNumber, movesTimes, whiteTimeLeft, blackTimeLeft 
            this.gamesList.set(key,getInitialGameObject(time));
        }

        // Get the player color give the userId
        static getPlayerColor = (userId:string) => {
            return this.playerColor.get(userId) as color;
        }
    };

export default Game;
