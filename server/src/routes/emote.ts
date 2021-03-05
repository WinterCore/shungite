import { Router }           from "express";
import Validator            from "validator";
import { createReadStream } from "fs";
import * as Path            from "path";

import Emote from "../database/models/emote";

import { co } from "./helpers";

import BadRequestError from "./errors/badrequest";
import NotFoundError   from "./errors/notfound";

import { EMOTE_DIRECTORY, EMOTE_SIZES } from "../config";

const router = Router();

router.get("/:keyword/:size", co(async (req, res, next) => {
    const { size, keyword } = req.params;
    if (Object.keys(EMOTE_SIZES).indexOf(size) === -1) throw new BadRequestError();

    const emote = await Emote.findOne({ keyword });
    if (!emote) throw new NotFoundError();

    res.setHeader("Content-Type", emote.type === "gif" ? "image/gif" : "image/png");

    const stream = createReadStream(Path.join(EMOTE_DIRECTORY, emote._id.toString(), size));
    stream.on("error", (e) => console.log(e) as unknown as undefined || next(new NotFoundError()));
    stream.on("ready", () => stream.pipe(res));
}));


export default router;
