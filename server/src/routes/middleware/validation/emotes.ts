import { RequestHandler } from "express";
import Validator          from "validator";

import Emote from "../../../database/models/emote";

import { co } from "../../helpers";

import ValidationError, { ValidationErrorsObj } from "../../errors/validation";

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
