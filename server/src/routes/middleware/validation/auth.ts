import { RequestHandler } from "express";
import Validator          from "validator";

import ValidationError, { ValidationErrorsObj } from "../../errors/validation";

export const twitchAuth: RequestHandler = (req, _, next) => {
    const { code } = req.body;

    let errors: ValidationErrorsObj = {};
    if (!code || !Validator.isLength(code, { min: 30, max: 30 })) {
        errors["code"] = ["The code must be a 30 character string."];
    }

    if (Object.keys(errors).length) {
        return next(new ValidationError(errors));
    }
    next();
};
