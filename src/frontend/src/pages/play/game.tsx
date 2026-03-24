import { useGameState } from "@/lib/states/gameState";
import { useEffect } from "react";
import { gameState as gameStateType} from "./lib";
import { navigateBasedOnLogin } from "@/lib/utils";
import { useNavigate } from "react-router";
import { PlayPage, PlayLoading, EndScreen } from "./components";

export const Play = () => {
    const {gameState,winner} = useGameState();
    const navigate = useNavigate();


    useEffect(() => {
        navigateBasedOnLogin(() => 
        {navigate("/login",{replace:true})},
            false)
        if(gameState == gameStateType.noSocket){
            navigate("/")
        }
    },[])

    if(gameState == gameStateType.waiting){
        return <PlayLoading/>
    }
    else if(gameState == gameStateType.running){
        return (
            <PlayPage/>
        )
    }
    else if(gameState == gameStateType.ended || winner){
        return <EndScreen winner={winner} />
    }
}
