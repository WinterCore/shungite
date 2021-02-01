import { ErrorRequestHandler } from "express";

import RoutingError    from "./error";

import Logger from "../../logger";

const ErrorHandler: ErrorRequestHandler = (err, _1, res, _2) => {
    if (err instanceof RoutingError) {
        res.status(err.status);
        res.json(err.toJson());
    } else {
        Logger.error(err.stack);
        res.status(500);
        res.json({ message: "Something happened on our end, Blame Skippar!" });
    }
};

export default ErrorHandler;
