import { sign, verify } from "jsonwebtoken";

import { JWT_SECRET, JWT_EXPIRE_IN } from "../../config";

type JWTData = {
    id: string;
};

export const encrypt = (payload: JWTData): Promise<string | null> => {
    return new Promise((resolve) => {
        sign({
                data: payload,
                expiresIn: JWT_EXPIRE_IN.toString()
            },
            JWT_SECRET,
            (err: Error | null, token ?: string) => {
                if (err || !token) return resolve(null);
                resolve(token);
            }
        );
    });
};

export const decrypt = (token: string): Promise<JWTData | null> => {
    return new Promise((resolve) => {
        verify(token, JWT_SECRET, (err, decoded ?: any) => {
            if (err || !decoded) return resolve(null);
            resolve(decoded.data as JWTData);
        });
    });
};
