import { getInitialGameObject } from "../../common/game";
import { color, gameTypes } from "../../common/interfaces/enums";
import type { gameObject, gameOverReasons } from "../../common/interfaces/game";
import Data from "./data";
import type { userOppo } from "./interfaces";

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
        static userOppo: userOppo = new Map();

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

        // Removes a game object
        static removeGameObject(whiteUserId:string, blackUserId:string){
            const key = Data.getKey(whiteUserId,blackUserId);
            this.gamesList.delete(key);
        }

        // Get the player color give the userId
        static getPlayerColor = (userId:string) => {
            return this.playerColor.get(userId) as color;
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

        // Removes all the in memory data about the game
        static endGame(whiteUserId:string, blackUserId:string){
            this.removeGameObject(whiteUserId,blackUserId);
            this.playerColor.delete(whiteUserId);
            this.playerColor.delete(blackUserId);
            this.removeUsersOppo(whiteUserId,blackUserId);
            Data.removeUserIdSocket(whiteUserId);
            Data.removeUserIdSocket(blackUserId);
        }

        // Stores the game on the backend
        static async storeGame(gameObject:gameObject,winnerId:string,whiteUserId:string,blackUserId:string,gameOverReason:gameOverReasons,incrementTime:number,gameTime:number){
            let gameType = gameTypes.Bullet;
            if(gameTime >= 2 * (60 * 1000)){// If time >= 2 minutes then Blitz
                gameType = gameTypes.Blitz;
            }
            else if(gameTime >= 7*(60 * 1000)){// If time >= 7 minutes Rapid
                gameType = gameTypes.Rapid;
            }
            await Data.storeGameDatabase(gameObject,winnerId,whiteUserId,blackUserId,gameOverReason,incrementTime,gameTime,gameType);

        }
    };

export default Game;
