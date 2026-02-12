import { generateKeyPair } from "jose";

const {publicKey} =await generateKeyPair("RS256");

export type keyType = typeof publicKey;

export interface keys{
        publicKey : keyType,
        privateKey : keyType
}
