import { color } from '../../common/interfaces/enums';
import Data from '../database/data';
import type { gameObject } from '../database/interfaces';

export const getOpponentColor = (inColor: color): color[] => {
    const res: color[] = [];
    switch (inColor) {
        case color.Black:
            res.push(color.White);
            res.push(color.Random);
            break;
        case color.White:
            res.push(color.Black);
            res.push(color.Random);
            break;
        case color.Random:
            res.push(color.Black);
            res.push(color.Random);
            res.push(color.White);
    }

    return res;
};

export const getOpponent = (
    inColor: color,
    time: number,
    increment: number,
): {
    oppo: gameObject;
    color: color;
} | null => {
    const oppColors: color[] = getOpponentColor(inColor);
    for (const c of oppColors) {
        try {
            const oppo = Data.getGame(c, time, increment);
            if (oppo != undefined) {
                return { oppo, color: c };
            }
        } catch {
            // eslint-disable-next-line
        }
    }
    return null;
};
