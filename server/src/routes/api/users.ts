import { Router } from "express";
import Validator  from "validator";

import { co } from "../helpers";

import TwitchUser   from "../../database/models/twitch-user";
import userResource from "./resources/user";

import NotFoundError from "../errors/notfound";

const router = Router();

router.get("/:id", co(async (req, res) => {
    const { id } = req.params;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const user = await TwitchUser.findById(id);
    if (!user) throw new NotFoundError();

    res.json({ data: userResource(user) });
}));

export default router;

