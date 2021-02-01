import { sign, verify } from "jsonwebtoken";

import { JWT_SECRET, JWT_EXPIRE_IN } from "../../config";

type JWTData = {
    id: string;
};

export const encrypt = (payload: JWTData): Promise<string> => {
    return new Promise((resolve, reject) => {
        sign({
                data: payload,
                expiresIn: JWT_EXPIRE_IN.toString()
            },
            JWT_SECRET,
            (err: Error | null, token ?: string) => {
                if (err || !token) return reject(err);
                resolve(token);
            }
        );
    });
};

export const decrypt = (token: string): Promise<JWTData> => {
    return new Promise((resolve, reject) => {
        verify(token, JWT_SECRET, (err, decoded ?: any) => {
            if (err || !decoded) return reject(err);
            resolve(decoded.data as JWTData);
        });
    });
};
