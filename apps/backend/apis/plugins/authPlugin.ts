import { errorPlugin } from './errorPlugin';
import JWT from '../../helper/jwt';
import { JWT_PAYLOAD } from '../../interfaces/jwt_payload';
import Elysia from 'elysia';
import { gameCreateZod } from '@schach/common/interfaces/gameZodTypes';
import { gameCreate } from '../../interfaces/game';
import Data from '../../database/data';
import { Zobrist } from '@schach/common/interfaces/Zobrist';

// This adds user:{username,userId} to the context.
export const authQueryPlugin = new Elysia().use(errorPlugin).resolve({as:'scoped'},async ({ query,status}) => {
    // Verify query exists
    if (query == undefined) {
        throw new Error('query is absent.');
    }

    // Get the token
    const splitted = query['authorization']?.split(" ");
    if (splitted == undefined || splitted.length != 2) {
        throw new Error('No auth query given in the query.');
    }
    const token = splitted[1];
    let user: JWT_PAYLOAD | undefined;
    if(token){
        // Get the user
        const res: JWT_PAYLOAD = await JWT.verify(token);
        // Add user to the context
        user = res;
    }
    else{
        throw new Error('No auth query given in the query.');
    }

    // Now after verifying token get game info
    const res = gameCreateZod.safeParse(query);
    if (!res.success) {
        return status(400);
    }
    const { color, time, increment } = res.data as gameCreate;

    // Check if the user is in the queue
    if (Data.isUserWaiting((user as JWT_PAYLOAD).userId)) {
        return status(400);
    }

    return {
        user: {
            color,
            time,
            increment,
            ...user,
        },
    };
});

// Get colors, time and increment and also generates a random userId for anonymouse game play
export const anonymousGameStartPlugin = new Elysia().use(errorPlugin).resolve({as:'scoped'},async ({ query,status}) => {
    console.log("got request")
    const res = gameCreateZod.safeParse(query);
    if (!res.success) {
        return status(400);
    }
    const { color, time, increment } = res.data as gameCreate;
    const userId = Zobrist.getRandomNumber().toString();

    return {
        user: {
            color,
            time,
            increment,
            userId
        },
    };
})


// This adds user:{username,userId} to the context.
export const authHeaderPlugin = new Elysia().use(errorPlugin).resolve({as:'scoped'},async ({headers}) => {
    // Verify headers exists
    console.log("request received")
    if (headers == undefined) {
        throw new Error('headers is absent.');
    }
    console.log("headers present")

    // Get the token
    const splitted = headers['authorization']?.split(" ");
    if (splitted == undefined || splitted.length != 2) {
        throw new Error('No auth headers given in the headers.');
    }
    console.log("got token")
    const token = splitted[1];
    let user: JWT_PAYLOAD | undefined;
    if(token){
        // Get the user
        console.log('testing token')
        const res: JWT_PAYLOAD = await JWT.verify(token);
        console.log('correct token')
        user = res;
    }
    else{
        throw new Error('No auth query given in the query.');
    }
    // Add user to the context
    return {user}
});
