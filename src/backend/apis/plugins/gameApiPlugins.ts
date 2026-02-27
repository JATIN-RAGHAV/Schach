import { gameCreateZod } from '../../../common/interfaces/gameZodTypes';
import { type gameCreate } from '../../interfaces/game';
import authPlugin from './authPlugin';
import Data from '../../database/data';

export const gameCreatePlugin = authPlugin.resolve(
    ({ headers, user, status }) => {
        const res = gameCreateZod.safeParse(headers);
        if (!res.success) {
            return status(400);
        }
        const { color, time, increment } = res.data as gameCreate;

        if (Data.isUserQueue(user.userId)) {
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
    },
);
