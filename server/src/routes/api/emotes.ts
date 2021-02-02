import { Router }  from "express";
import * as Multer from "multer";



import Emote            from "../../database/models/emote";
import { createEmote }  from "../middleware/validation/emotes";
import { processEmote } from "../services/emote";
import { co }           from "../helpers";
import Logger           from "../../logger";

const router = Router();

const emoteUploader = Multer().single("emote")

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

export default router;

