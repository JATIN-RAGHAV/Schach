import { SignJWT, jwtVerify, generateKeyPair } from 'jose';
import { type JWT_PAYLOAD } from '../interfaces/jwt_payload';
import { type keyType } from '../interfaces/keys';
import { exportJWK, importJWK, type JWK } from 'jose';

class JWT {
    static publicKey: keyType;
    static privateKey: keyType;
    static path: string = 'src/backend/helper/keys.json';

    static async initKeys() {
        const keyFile = Bun.file(this.path);
        const keys = (await keyFile.json()) as {
            publicKey: JWK;
            privateKey: JWK;
        };
        if (keys.publicKey && keys.privateKey) {
            this.privateKey = (await importJWK(
                keys.privateKey,
                'RS256',
            )) as keyType;
            this.publicKey = (await importJWK(
                keys.publicKey,
                'RS256',
            )) as keyType;
        } else {
            this.genNewKeys();
        }
    }

    static async genNewKeys() {
        const res = await generateKeyPair('RS256', { extractable: true });
        this.publicKey = res.publicKey;
        this.privateKey = res.privateKey;
        const keys = {
            publicKey: await exportJWK(this.publicKey),
            privateKey: await exportJWK(this.privateKey),
        };
        Bun.write(this.path, JSON.stringify(keys));
    }

    static async clearKeys() {
        Bun.write(this.path, '{}');
    }

    static async verify(token: string): Promise<JWT_PAYLOAD> {
        const res = (await jwtVerify(token, this.publicKey)).payload
            .payload as JWT_PAYLOAD;
        return res;
    }

    static async sign(payload: JWT_PAYLOAD): Promise<string> {
        const jwt = await new SignJWT({ payload })
            .setProtectedHeader({ alg: 'RS256' })
            .sign(this.privateKey);
        return jwt;
    }
}

export default JWT;
