import { invalidTimeKey } from "../helper/errors";

export const getTimeKey = (time:number, increment:number) => {
        return `${time}:${increment}`
}

export const getTimeAndIncrement = (timeKey:string):[time:number,increment:number] => {
        const times = timeKey.split(':').map((v) => parseInt(v));
        if(times.length != 2){
                throw invalidTimeKey
        }
        const time:number = times[0]==undefined ? 1 : times[0]
        const increment:number = times[1]==undefined ? 1 : times[1]

        return [time,increment]
}
