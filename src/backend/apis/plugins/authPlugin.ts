import { errorPlugin } from './errorPlugin';
import JWT from '../../helper/jwt';
import { type JWT_PAYLOAD } from '../../interfaces/jwt_payload';

const authPlugin = errorPlugin.resolve(async ({ headers }) => {
    // Verify heads exist
    if (headers == undefined) {
        throw new Error('headers is absent.');
    }

    // Get the token
    const splitted = headers['authorization']?.split(" ");
    if (splitted == undefined || splitted.length != 2) {
        throw new Error('No auth headers given in the headers.');
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
    throw new Error('No auth headers given in the headers.');
});

export default authPlugin;
