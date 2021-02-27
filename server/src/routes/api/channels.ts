import { Router } from "express";

import TwitchUser from "../../database/models/twitch-user";
import { EmoteStatus } from "../../database/models/emote";

import NotFoundError from "../errors/notfound";
import { emoteResource } from "./resources/emote";

import { co } from "../helpers";

const router = Router();

router.get("/:username/emotes", co(async (req, res) => {
    const user = await TwitchUser.findOne({ username: req.params.username });
    if (!user) throw new NotFoundError();

    const publicEmotes = await user.publicEmotes({ status: EmoteStatus.APPROVED });
    const uploadedEmotes = await user.uploadedEmotes({ status: EmoteStatus.APPROVED });

    res.json({
        data: [
            ...publicEmotes.map(emoteResource(req)),
            ...uploadedEmotes.map(emoteResource(req)),
        ],
    });
}));

export default router;
