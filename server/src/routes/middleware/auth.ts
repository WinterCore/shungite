import { RequestHandler } from "express";

import Token      from "../../database/models/token";
import TwitchUser from "../../database/models/twitch-user";

import Unauthenticated from "../errors/unauthenticated";

import { decrypt } from "../services/jwt";

const auth: RequestHandler = async (req, _, next) => {
    const token = (req.header("Authorization") || "").slice("Bearer ".length);
    if (!token) return next(new Unauthenticated());

    try {
        const count = await Token.countDocuments({ token, active: true });
        if (count === 0) return next(new Unauthenticated());

        try {
            const data = await decrypt(token);
            req.user = await TwitchUser.findById(data.id);
            next();
        } catch (e) {
            return next(new Unauthenticated());
        }
    } catch (e) {
        next(e);
    }
};

export default auth;
