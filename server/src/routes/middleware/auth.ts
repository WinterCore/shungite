import { RequestHandler } from "express";

import Token      from "../../database/models/token";
import TwitchUser, {TwitchUserDoc} from "../../database/models/twitch-user";

import Unauthenticated from "../errors/unauthenticated";

import { decrypt } from "../services/jwt";

const getUserFromToken = async (token: string): Promise<TwitchUserDoc> => {
    const count = await Token.countDocuments({ token, active: true });
    if (count === 0) throw new Error("Token is blacklisted");

    const data = await decrypt(token);
    const user = await TwitchUser.findById(data.id);

    if (!user) throw new Error("User was not found");
    return user;
};

export const populateUser: RequestHandler = async (req, _, next) => {
    const token = (req.header("Authorization") || "").slice("Bearer ".length);
    if (!token) return next();

    try {
        req.user = await getUserFromToken(token);
    } catch (e) {}
    next();
};

const auth: RequestHandler = async (req, _, next) => {
    const token = (req.header("Authorization") || "").slice("Bearer ".length);
    if (!token) return next(new Unauthenticated());

    try {
        req.user = await getUserFromToken(token);
        next();
    } catch (e) {
        next(e);
    }
};

export default auth;
