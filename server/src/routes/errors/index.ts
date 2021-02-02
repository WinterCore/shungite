import { ErrorRequestHandler } from "express";
import { MulterError }         from "multer";

import RoutingError    from "./error";
import ValidationError from "./validation";

import Logger from "../../logger";

const ErrorHandler: ErrorRequestHandler = (err, _1, res, _2) => {
    if (err instanceof RoutingError) {
        res.status(err.status);
        res.json(err.toJson());
    } else if (err instanceof MulterError) {
        const validationErr = new ValidationError({ [err.field!]: "Unexpected file" });
        res.status(422);
        res.json(validationErr.toJson());
    } else {
        Logger.error(err.stack);
        res.status(500);
        res.json({ message: "Something happened on our end, Blame Skippar!" });
    }
};

export default ErrorHandler;
