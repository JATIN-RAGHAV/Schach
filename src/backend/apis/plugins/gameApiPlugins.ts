import { gameCreateZod } from '../../../common/interfaces/gameZodTypes';
import { type gameCreate } from '../../interfaces/game';
import { color as colorType } from '../../../common/interfaces/enums';
import authPlugin from './authPlugin';
import Data from '../../database/data';

export const gameCreatePlugin = authPlugin.resolve(
    ({ headers, user, status }) => {
        const res = gameCreateZod.safeParse(headers);
        if (!res.success) {
            return status(400);
        }
        const { color, time, increment } = res.data as gameCreate;
        const colorEnum = color as colorType;
        if (color >= 3 || color < 0) {
            return status(400);
        }

        if (Data.isUserQueue(user.userId)) {
            return status(400);
        }

        return {
            user: {
                color: colorEnum,
                time,
                increment,

                ...user,
            },
        };
    },
);
