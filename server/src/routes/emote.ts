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

router.get("/:id/:size", co(async (req, res) => {
    const { size, id } = req.params;
    if (Object.keys(EMOTE_SIZES).indexOf(size) === -1) throw new BadRequestError();
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.findById(id);
    if (!emote) throw new NotFoundError();

    res.setHeader("Content-Type", emote.type === "gif" ? "image/gif" : "image/png");

    createReadStream(Path.join(EMOTE_DIRECTORY, id, size)).pipe(res);
}));


export default router;
