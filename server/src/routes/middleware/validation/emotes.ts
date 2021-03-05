import { RequestHandler } from "express";
import Validator          from "validator";

import Emote, { EmoteStatus } from "../../../database/models/emote";
import TwitchUserEmote        from "../../../database/models/twitch-user-emote";

import { co } from "../../helpers";

import ValidationError, { ValidationErrorsObj } from "../../errors/validation";
import NotFoundError                            from "../../errors/notfound";
import UnauthorizedError                        from "../../errors/unauthorized";

export const createEmote: RequestHandler = co(async (req, _, next) => {
    const { is_private, keyword } = req.body;

    let errors: ValidationErrorsObj = {};

    if (req.file === undefined) {
        errors.emote = "This field is required";
    }

    if (is_private === undefined || ["true", "false"].indexOf(is_private) === -1) {
        errors.is_private = "Invalid value. It should either be 'true' or 'false'";
    }

    if (keyword === undefined || !Validator.isAlphanumeric(keyword)) {
        errors.keyword = "Keywords can only contain alphanumeric characters";
    }

    if (await Emote.countDocuments({ keyword }) > 0) {
        errors.keyword = `Keyword '${keyword}' has already been used.`;
    }

    if (Object.keys(errors).length) {
        return next(new ValidationError(errors));
    }
    next();
});

export const addChannelEmote: RequestHandler = co(async (req, _, next) => {
    const { id } = req.params;
    const { _id: userId } = req.user!;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.findOne({ _id: id, isPrivate: false, status: EmoteStatus.APPROVED });
    if (!emote) throw new NotFoundError();

    if (req.user!._id.equals(emote.owner) || await TwitchUserEmote.countDocuments({ user: userId, emote: id }) > 0)
        throw new UnauthorizedError("This emote already exists in your emotes list.");
    next();
});

export const deleteChannelEmote: RequestHandler = co(async (req, _, next) => {
    const { id } = req.params;
    const { _id: userId } = req.user!;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.countDocuments({ _id: id });
    if (!emote) throw new NotFoundError();

    if (await TwitchUserEmote.countDocuments({ user: userId, emote: id }) === 0)
        throw new UnauthorizedError("You don't have this emote in your emotes list.");
    next();
});

export const approveEmote: RequestHandler = co(async (req, _, next) => {
    const { id } = req.params;
    if (!Validator.isMongoId(id)) throw new NotFoundError();

    const emote = await Emote.findById(id);
    if (!emote) throw new NotFoundError();
    if (emote.status !== EmoteStatus.PENDING) throw new UnauthorizedError("Only pending emotes can be approved!");

    next();
});

export const rejectEmote: RequestHandler = co(async (req, _, next) => {
    const { id }     = req.params;
    const { reason } = req.body;

    if (!Validator.isMongoId(id)) throw new NotFoundError();
    if (reason === undefined || reason.length === 0) throw new ValidationError({ reason: "This field is required" });

    const emote = await Emote.findById(id);
    if (!emote) throw new NotFoundError();
    if (emote.status !== EmoteStatus.PENDING) throw new UnauthorizedError("Only pending emotes can be rejected!");

    next();
});