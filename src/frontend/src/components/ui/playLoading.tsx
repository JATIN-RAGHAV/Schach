import { getCellSize } from "@/lib/utils"
import { Skeleton } from "./skeleton"

export const PlayLoading = () => {
    const cellSize = getCellSize();
    const boardSize = cellSize*8;
    return <div className="flex flex-col justify-center h-dvh items-center gap-6">
    <div className="font-bold text-4xl">Finding an Opponent..... </div>
    <Skeleton className="z-0" style={{width:boardSize,height:boardSize}}>
    </Skeleton>
    </div>
}

