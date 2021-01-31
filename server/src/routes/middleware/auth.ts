import { RequestHandler } from "express";

import Token      from "../../database/models/token";
import TwitchUser from "../../database/models/twitch-user";

import Unauthenticated from "../errors/unauthenticated";

import { decrypt } from "../services/jwt";

const auth: RequestHandler = async (req, _, next) => {
    const token = (req.header("Authorization") || "").slice("Bearer ".length);
    if (!token) return next(new Unauthenticated());

    try {
        const exists = await Token.countDocuments({ token, active: true });
        if (exists === 0) return next(new Unauthenticated());

        const data = await decrypt(token);
        if (!data) return next(new Unauthenticated());

        req.user = await TwitchUser.findById(data.id);
    } catch (e) {
        next(e);
    }
};

export default auth;
