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
        // Data structures to store data related to anonymous users
        static anonymousGamesList:Map<string,gameObject>=new Map<string,gameObject>();
        static anonymousPlayerColor:Map<string,color>=new Map<string,color>();
        static anonymousUserOppo: userOppo = new Map();

        // Get the key for a pair of users
        static getKey(whiteUserId:string, blackUserId:string){
            return whiteUserId+':'+blackUserId;
        }

        // Get the game object give the user Ids
        static getGameObject(whiteUserId:string, blackuserId:string, isAnonymous:boolean){
            const key = this.getKey(whiteUserId,blackuserId);
            if(isAnonymous){
                return this.anonymousGamesList.get(key)
            }
            else{
                return this.gamesList.get(key)
            }
        }

        // Initalise a gameObject and add it to the gamesList
        static setGameObject(whiteUserId:string, blackUserId:string,time:number,isAnonymous:boolean){
            const key = Data.getKey(whiteUserId,blackUserId);

            if(isAnonymous){
                // Set user colors
                this.anonymousPlayerColor.set(blackUserId,color.Black);
                this.anonymousPlayerColor.set(whiteUserId,color.White);

                //moveNumber, movesTimes, whiteTimeLeft, blackTimeLeft 
                this.anonymousGamesList.set(key,getInitialGameObject(time));
            }
            else{
                // Set user colors
                this.playerColor.set(blackUserId,color.Black);
                this.playerColor.set(whiteUserId,color.White);

                //moveNumber, movesTimes, whiteTimeLeft, blackTimeLeft 
                this.gamesList.set(key,getInitialGameObject(time));
            }
        }

        // Removes a game object
        static removeGameObject(whiteUserId:string, blackUserId:string, isAnonymous:boolean){
            const key = Data.getKey(whiteUserId,blackUserId);
            if(isAnonymous){
                this.anonymousGamesList.delete(key);
            }
            else{
                this.gamesList.delete(key);
            }
        }

        // Get the player color given the userId
        static getPlayerColor = (userId:string, isAnonymous: boolean) => {
            if(isAnonymous){
                return this.anonymousPlayerColor.get(userId) as color;
            }
            
            return this.playerColor.get(userId) as color;
        }

        static getUserOppo(userId:string,isAnonymous:boolean):(string|null){
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

        static isUserPlaying(userId:string,isAnonymous:boolean):boolean{
            if(isAnonymous){
                return this.anonymousUserOppo.has(userId);
            }
            return this.userOppo.has(userId);
        }

        static setUserOppo(user1Id:string, user2Id:string, isAnonymous:boolean):boolean{
            if(this.isUserPlaying(user1Id, isAnonymous) || this.isUserPlaying(user2Id,isAnonymous)){
                return false
            }
            if(isAnonymous){
                this.anonymousUserOppo.set(user1Id,user2Id)
                this.anonymousUserOppo.set(user2Id,user1Id)
            }
            else{
                this.userOppo.set(user1Id,user2Id)
                this.userOppo.set(user2Id,user1Id)
            }
            return true
        }

        static removeUsersOppo(user1Id:string, user2Id:string,isAnonymous:boolean):boolean{
            if(!this.isUserPlaying(user1Id,isAnonymous) || !this.isUserPlaying(user2Id,isAnonymous)){
                return false
            }
            if(isAnonymous){
                this.anonymousUserOppo.delete(user1Id)
                this.anonymousUserOppo.delete(user2Id)
            }
            else{
                this.userOppo.delete(user1Id)
                this.userOppo.delete(user2Id)
            }
            return true
        }

        // Removes all the in memory data about the game
        static endGame(whiteUserId:string, blackUserId:string,isAnonymous:boolean){
            this.removeGameObject(whiteUserId,blackUserId,isAnonymous);
            this.removeUsersOppo(whiteUserId,blackUserId,isAnonymous);
            if(isAnonymous){
                this.anonymousPlayerColor.delete(whiteUserId);
                this.anonymousPlayerColor.delete(blackUserId);
            }
            else{
                this.playerColor.delete(whiteUserId);
                this.playerColor.delete(blackUserId);
            }
            Data.removeUserIdSocket(whiteUserId,isAnonymous);
            Data.removeUserIdSocket(blackUserId,isAnonymous);
        }

        // Stores the game on the backend
        static async storeGame(gameObject:gameObject,winnerId:string,whiteUserId:string,blackUserId:string,gameOverReason:gameOverReasons,incrementTime:number,gameTime:number,isAnonymous: boolean){
            let gameType = gameTypes.Bullet;
            console.log(`Game Time: ${gameTime}`)
            if(gameTime >= 2 * (60 * 1000)){// If time >= 2 minutes then Blitz
                gameType = gameTypes.Blitz;
            }
            if(gameTime >= 7*(60 * 1000)){// If time >= 7 minutes Rapid
                gameType = gameTypes.Rapid;
            }
            if(!isAnonymous){
                Data.storeGameDatabase(gameObject,winnerId,whiteUserId,blackUserId,gameOverReason,incrementTime,gameTime,gameType).then(() => {
                    console.log("Game stored on database");
                })
            }

        }
    };

export default Game;
