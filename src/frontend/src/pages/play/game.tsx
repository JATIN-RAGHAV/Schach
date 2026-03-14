import { useGame } from "@/lib/interfaces/customHooks";
import { useEffect } from "react";
import { gameState as gameStateType} from "./lib";
import { useOnMessageHandlerState } from "@/lib/interfaces/onMessageHandlerState";
import { navigateBasedOnLogin } from "@/lib/utils";
import { useNavigate } from "react-router";
import { PlayPage, PlayLoading } from "./components";

export const Play = () => {
    const {winner} = useOnMessageHandlerState();
    const {gameState} = useGame();
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
        return <h1>
        Game Over
        <h2>
        Winner: {winner}
        </h2>
        </h1>
    }
}
