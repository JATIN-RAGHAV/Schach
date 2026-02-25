import {type gameObject, gameOverReasons, type moveSocketResponse } from '../../common/interfaces/game';
import { type gameState } from '../../common/interfaces/enums';

export const getResponsePostMove = (gameState:gameState,gameObject:gameObject,move:string) => {

    let currentPlayerResponse:moveSocketResponse = {
        move:move,
        winner:false,
        error:false,
        over:false,
        whyOver:gameOverReasons.notOver,
        message:"You will lose.",
        whiteTimeLeft:gameObject.whiteTimeLeft,
        blackTimeLeft:gameObject.blackTimeLeft
    }
    let oppoPlayerResponse:moveSocketResponse = {...currentPlayerResponse}

    if(gameState.over){
        currentPlayerResponse.over = true;
        currentPlayerResponse.whyOver = gameState.gameEndReason;
        oppoPlayerResponse.over = true;
        oppoPlayerResponse.whyOver = gameState.gameEndReason;
        if([gameOverReasons.checkmate,gameOverReasons.timeover,gameOverReasons.otherResigned,gameOverReasons.otherAbandoned].includes(gameState.gameEndReason)){
            currentPlayerResponse.winner = true;
            currentPlayerResponse.message = "You won";
            oppoPlayerResponse.winner = false;
            oppoPlayerResponse.message = "You lose.";
        }
        else{
            currentPlayerResponse.winner = false;
            currentPlayerResponse.message = "You lose.";
            oppoPlayerResponse.winner = false;
            oppoPlayerResponse.message = "You won";
        }
    }


    return {currentPlayerResponse,oppoPlayerResponse}
}
