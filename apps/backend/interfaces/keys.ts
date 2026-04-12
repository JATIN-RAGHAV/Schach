import { generateKeyPair } from 'jose';

type keyPair = Awaited<ReturnType<typeof generateKeyPair>>;
export type keyType = keyPair['publicKey'];

export interface keys {
    publicKey: keyType;
    privateKey: keyType;
}
