import { GalleryVerticalEnd } from "lucide-react"
import { gameTypes,color as colors }from "@/../../common/interfaces/enums"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { startGame } from "@/lib/network/websocket"
import { useNavigate } from "react-router"
import { useGame } from "@/main"
export const GamePage = () => {
    const [gameType,setGameType] = useState<gameTypes>(gameTypes.Rapid);
    const [color,setcolor] = useState<colors>(colors.Random);
    const [gameIncrement,setGameIncrement] = useState<string>("0");
    const [start,setStart] = useState<boolean>(false);
    const gameState = useGame();
    const navigate = useNavigate();
    useEffect(() => {
        if(start){
            navigate("/play");
        }
    },[start])

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6 items-center">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd   className="size-4" />
                    </div>
                    Schach
                </a>

                <Select defaultValue={color}
                    onValueChange={(value) => {
                        setcolor(value as colors);
                    }}
                >
                    <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                    >
                    <SelectGroup>
                    <SelectLabel>colors</SelectLabel>
                    <SelectItem value={colors.Random}>{colors.Random}</SelectItem>
                    <SelectItem value={colors.White}>{colors.White}</SelectItem>
                    <SelectItem value={colors.Black}>{colors.Black}</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>



                <Select defaultValue={gameType}
                    onValueChange={(value) => {
                        setGameType(value as gameTypes);
                    }}
                >
                    <SelectTrigger className="w-full max-w-48">
                    <SelectValue/>
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                    >
                    <SelectGroup>
                    <SelectLabel>Game Type</SelectLabel>
                    <SelectItem value={gameTypes.Rapid}>{gameTypes.Rapid}</SelectItem>
                    <SelectItem value={gameTypes.Blitz}>{gameTypes.Blitz}</SelectItem>
                    <SelectItem value={gameTypes.Bullet}>{gameTypes.Bullet}</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>



                <Select defaultValue={gameIncrement}
                    onValueChange={(value) => {
                        setGameIncrement(value as string);
                    }}
                >
                    <SelectTrigger className="w-full max-w-48">
                    <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        position="popper"
                    >
                    <SelectGroup>
                    <SelectLabel>Game Increment</SelectLabel>
                    <SelectItem value="0">no Increment</SelectItem>
                    <SelectItem value="5000">5 Secs</SelectItem>
                    <SelectItem value="10000">10 Secs</SelectItem>
                    <SelectItem value="15000">15 Secs</SelectItem>
                    </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={()=> {
                const res = startGame(color,gameType,parseInt(gameIncrement));
                res.onopen = () => {
                    gameState.setColor(color);
                    gameState.setGameType(gameType);
                    gameState.setGameIncrement(parseInt(gameIncrement));
                    gameState.setSocket(res);
                    setStart(true);
                }
                res.onerror = (err) => {
                    console.error("Error starting game",err);
                    alert("Error starting game");
                }

            }}
            className="w-full max-w-sm">Start Game</Button>
        </div>
    )
}
