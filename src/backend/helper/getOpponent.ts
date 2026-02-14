import { color } from "../../common/interfaces/enums"
import Data from "../database/data";
import type { userGameObject } from "../database/interfaces";

export const getOpponentColor = (inColor:color):color[] => {
        let res:color[] = [];
        switch (inColor){
                case color.Black:
                        res.push(color.White);
                        res.push(color.Random);
                        break;
                case color.White:
                        res.push(color.Black);
                        res.push(color.Random);
                        break;
                case color.Random:
                        res.push(color.Black);
                        res.push(color.Random);
                        res.push(color.White);
        }

        return res;
}

export const getOpponent = (inColor:color,time:number,increment:number):({
    oppo: userGameObject;
    color: color;
} | null)=> {
        let oppColors:color[] = getOpponentColor(inColor);
        for(let c of oppColors){
                try{
                        const oppo = Data.getGame(c,time,increment);
                        if(oppo != undefined){
                                return {oppo,color:c}
                        }
                }
                catch{}
        }
        return null
}
