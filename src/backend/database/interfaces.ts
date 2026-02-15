import { ElysiaWS } from 'elysia/ws';
import { color } from '../../common/interfaces/enums';

export interface UserData {
    id: string;
    username: string;
    hashpass: string;
}

export interface gameObject {
    userId: string;
    username: string;
    ws: ElysiaWS;
}

export type userQueue = Set<string>;

export type gameObjectQueue = Record<
    color,
    Record<string, Map<string, gameObject>>
>;
