import { errorPlugin } from './errorPlugin';
import JWT from '../../helper/jwt';
import { type JWT_PAYLOAD } from '../../interfaces/jwt_payload';

const authPlugin = errorPlugin.resolve(async ({ query }) => {
    // Verify query exists
    console.log('authenticating')
    if (query == undefined) {
        throw new Error('query is absent.');
    }
    console.log('no query')

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
