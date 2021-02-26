import { Router } from "express";

import { co } from "../helpers";

import TwitchUser   from "../../database/models/twitch-user";
import { userResource } from "./resources/user";

import emoteResource from "./resources/emote";

import NotFoundError from "../errors/notfound";

const router = Router();

router.get("/:username", co(async (req, res) => {
    const { username } = req.params;
    if (!username) throw new NotFoundError();

    const user = await TwitchUser.findOne({ username });
    if (!user) throw new NotFoundError();

    const publicEmotes  = await user.publicEmotes();
    const uploadedEmotes = await user.uploadedEmotes();

    res.json({
        data: {
            ...userResource(req)(user),
            public_emotes   : publicEmotes.map(emoteResource(req)),
            uploaded_emotes : uploadedEmotes.map(emoteResource(req)),
        },
    });
}));

export default router;

