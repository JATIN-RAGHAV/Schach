import {SignJWT, jwtVerify, generateKeyPair} from 'jose'
import { type JWT_PAYLOAD } from '../interfaces/jwt_payload';

const {publicKey, privateKey} = await generateKeyPair("RS256")

export const verify = async (token: string):Promise<JWT_PAYLOAD>=>{
        const res  =  (await jwtVerify(token,publicKey)).payload.payload as JWT_PAYLOAD
        return res
}

export const sign = async (payload: JWT_PAYLOAD):Promise<string>=>{
        const jwt = await new SignJWT({payload})
                .setProtectedHeader({"alg":"RS256"})
                .setExpirationTime('2h')
                .sign(privateKey);
        return jwt
}
