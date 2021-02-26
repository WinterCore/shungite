import { RequestHandler } from "express";

import Unauthorized from "../errors/unauthorized";

const isAdmin: RequestHandler = (req, _, next) => {
    const user = req.user!;

    if (!user.isAdmin)
        throw new Unauthorized();
    next();
};

export default isAdmin;