import { Router }  from "express";
import * as Multer from "multer";
import Validator   from "validator";

import Emote, { EmoteStatus } from "../../database/models/emote";
import TwitchUserEmote        from "../../database/models/twitch-user-emote";
import { processEmote }       from "../services/emote";
import { co, getSortValue }   from "../helpers";
import Logger                 from "../../logger";

import { createEmote, addChannelEmote, deleteChannelEmote } from "../middleware/validation/emotes";

import emoteResource, { emoteDetailsResource } from "./resources/emote";

import NotFoundError from "../errors/notfound";

const router = Router();

const emoteUploader = Multer().single("emote")

const EMOTES_PER_PAGE = 20;

router.get("/", co(async (req, res) => {
    const page = +(req.query.page || "1") - 1; // Starts from 0
    const sort = req.query.sort?.toString();

    const emotes = await Emote
        .find({ isPrivate: false, status: EmoteStatus.APPROVED })
        .sort(getSortValue(sort, ["userCount", "createdAt"]))
        .limit(EMOTES_PER_PAGE)
        .skip(page * EMOTES_PER_PAGE);

    res.json({ data: emotes.map(emoteResource(req)) });
}));

router.get("/own", co(async (req, res) => {
    const user = req.user!;

    const publicEmotes  = await user.publicEmotes();
    const uploadedEmotes = await user.uploadedEmotes();

    res.json({
        data: {
            public_emotes   : publicEmotes.map(emoteResource(req)),
            uploaded_emotes : uploadedEmotes.map(emoteDetailsResource(req)),
        }
    });
}));

// Create emote
router.post("/", emoteUploader, createEmote, co(async (req, res) => {
    const t = req.file.originalname.endsWith("gif") ? "gif" : "image"

    const { keyword, is_private } = req.body

    const emote = await Emote.create({
        isPrivate : is_private,
        owner     : req.user!._id,
        type      : t,
        keyword,
    });

    // TODO: Do this in a job or something, and notify the owner of the results.
    processEmote(req.file.buffer, t, emote._id.toString())
        .catch(e => Logger.error("Something happened while processing emote %s %O", emote._id, e));

    res.json({
        message: "Your emote is being processed. It may take up to 5 minutes to show up in your dashboard",
    });
}));

// Get emote details
router.get("/:id", co(async (req, res) => {
    const { id } = req.params;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.findById(id).populate("owner");
    if (!emote) throw new NotFoundError();

    emote.added = req.user ? await emote.isAdded(req.user._id) : false;

    res.json({ data: emoteDetailsResource(req)(emote) });
}));

// Add emote to channel emotes
router.post("/:id/own", addChannelEmote, co(async (req, res) => {
    const { id }          = req.params;
    const { _id: userId } = req.user!;

    await TwitchUserEmote.create({ user: userId, emote: id });
    await Emote.updateOne({ _id: id }, { $inc: { userCount: 1 } });

    res.json({
        message: "Congratulations. Now you can go and spam the shit out of the emote."
    });
}));

// Add emote to channel emotes
router.delete("/:id/own", deleteChannelEmote, co(async (req, res) => {
    const { id }          = req.params;
    const { _id: userId } = req.user!;

    await TwitchUserEmote.deleteOne({ user: userId, emote: id });
    await Emote.updateOne({ _id: id }, { $inc: { userCount: -1 } });

    res.json({
        message: "Success."
    });
}));


export default router;

