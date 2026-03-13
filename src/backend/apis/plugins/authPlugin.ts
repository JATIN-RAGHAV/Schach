import { errorPlugin } from './errorPlugin';
import JWT from '../../helper/jwt';
import { type JWT_PAYLOAD } from '../../interfaces/jwt_payload';

// This adds user:{username,userId} to the context.
const authPlugin = errorPlugin.resolve(async ({ query }) => {
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
    if(token){
        // Get the user
        const res: JWT_PAYLOAD = await JWT.verify(token);
        // Add user to the context
        return {
            user: { ...res },
        };
    }
    throw new Error('No auth query given in the query.');
});

export default authPlugin;
