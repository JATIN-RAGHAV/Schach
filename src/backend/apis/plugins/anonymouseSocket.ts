import Elysia from "elysia";
import { errorPlugin } from "./errorPlugin";
import { gameCreateZod } from "../../../common/interfaces/gameZodTypes";
import { gameCreate } from "../../interfaces/game";
import { Zobrist } from "../../../common/interfaces/Zobrist";

// This adds user:{color,time,increment} to the context.
export const anonymousSocketPlugin = new Elysia().use(errorPlugin).resolve({as:'scoped'},async ({ query,status}) => {
    // Verify query exists
    if (query == undefined) {
        throw new Error('query is absent.');
    }

    // Now get game info
    const res = gameCreateZod.safeParse(query);
    if (!res.success) {
        return status(400);
    }
    const { color, time, increment } = res.data as gameCreate;

    const randomId = String(Zobrist.getRandomNumber());
    
    return {
        user: {
            color,
            time,
            increment,
            userId:randomId
        },
    };
});

