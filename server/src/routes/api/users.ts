import { Router } from "express";
import Validator  from "validator";

import { co } from "../helpers";

import TwitchUser   from "../../database/models/twitch-user";
import userResource from "./resources/user";

import emoteResource from "./resources/emote";
import authMiddleware from "../middleware/auth";

import NotFoundError from "../errors/notfound";

const router = Router();

router.get("/:id", authMiddleware, co(async (req, res) => {
    const { id } = req.params;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const user = await TwitchUser.findById(id);
    if (!user) throw new NotFoundError();

    const publicEmotes = await user.publicEmotes();

    res.json({
        data: {
            ...userResource(req)(user),
            public_emotes: publicEmotes.map(emoteResource(req))
        },
    });
}));

export default router;

