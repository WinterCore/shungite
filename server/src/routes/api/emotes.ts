import { Router }    from "express";
import * as Mongoose from "mongoose";
import * as Multer   from "multer";
import Validator     from "validator";

import Emote, { EmoteStatus } from "../../database/models/emote";
import TwitchUserEmote        from "../../database/models/twitch-user-emote";
import { processEmote }       from "../services/emote";
import { co, getSortValue }   from "../helpers";
import Logger                 from "../../logger";

import authMiddleware, { populateUser } from "../middleware/auth";
import isAdminMiddleware from "../middleware/is-admin";

import { createEmote, addChannelEmote, deleteChannelEmote } from "../middleware/validation/emotes";

import { emoteResource, emoteDetailsResource } from "./resources/emote";

import NotFoundError from "../errors/notfound";

const router = Router();

const emoteUploader = Multer().single("emote");

const EMOTES_PER_PAGE = 30;

// Fetch approved emotes
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

// Fetch all emotes (used by emote approvers)
router.get("/op", authMiddleware, isAdminMiddleware, co(async (req, res) => {
    const page = +(req.query.page || "1") - 1; // Starts from 0
    const status = req.query.status?.toString();

    const filter: Record<string, any> = {};
    if (status)
        filter.status = status;

    const emotes = await Emote
        .find(filter)
        .limit(EMOTES_PER_PAGE)
        .skip(page * EMOTES_PER_PAGE);

    res.json({ data: emotes.map(emoteDetailsResource(req)) });
}));

// Check if emote keyword is used
router.get("/keyword/check", authMiddleware, co(async (req, res) => {
    if (!req.query.keyword) {
        res.json(false);
    } else {
        const count = await Emote.countDocuments({ keyword: req.query.keyword.toString() });
        res.json(count === 0);
    }
}));

// Fetch own emotes
router.get("/own", authMiddleware, co(async (req, res) => {
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
router.post("/", authMiddleware, emoteUploader, createEmote, co(async (req, res) => {
    const t = req.file.originalname.endsWith("gif") ? "gif" : "image"

    const { keyword, is_private } = req.body

    const emoteId = Mongoose.Types.ObjectId();

    // TODO: Do this in a job or something, and notify the owner of the results.
    processEmote(req.file.buffer, t, emoteId.toHexString())
        .then(() => (
            Emote.create({
                _id       : emoteId,
                isPrivate : is_private,
                owner     : req.user!._id,
                type      : t,
                keyword,
            })
        ))
        .catch(e => Logger.error("Something happened while processing emote %s %O", emoteId.toHexString(), e));

    res.json({
        message: "Your emote is being processed. It may take up to 5 minutes to show up in your dashboard",
    });
}));

// Get emote details
router.get("/:id", populateUser, co(async (req, res) => {
    const { id } = req.params;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.findById(id).populate("owner");
    if (!emote) throw new NotFoundError();

    emote.added = req.user ? await emote.isAdded(req.user._id) : false;

    res.json({ data: emoteDetailsResource(req)(emote) });
}));

// Add emote to channel emotes
router.post("/:id/own", authMiddleware, addChannelEmote, co(async (req, res) => {
    const { id }          = req.params;
    const { _id: userId } = req.user!;

    await TwitchUserEmote.create({ user: userId, emote: id });
    await Emote.updateOne({ _id: id }, { $inc: { userCount: 1 } });

    res.json({
        message: "Congratulations. Now you can go and spam the shit out of the emote."
    });
}));

// Add emote to channel emotes
router.delete("/:id/own", authMiddleware, deleteChannelEmote, co(async (req, res) => {
    const { id }          = req.params;
    const { _id: userId } = req.user!;

    await TwitchUserEmote.deleteOne({ user: userId, emote: id });
    await Emote.updateOne({ _id: id }, { $inc: { userCount: -1 } });

    res.json({
        message: "Success."
    });
}));


export default router;

