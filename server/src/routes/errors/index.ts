import { ErrorRequestHandler } from "express";

import RoutingError from "./error";

import Logger from "../../logger";

const ErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (err instanceof RoutingError) {
        res.sendStatus(err.status);
        res.json({ message: err.message });
    } else {
        Logger.error(err.stack);
        res.sendStatus(500);
        res.json({ message: "Something happened on our end, Blame Skippar!" });
    }
};

export default ErrorHandler;
