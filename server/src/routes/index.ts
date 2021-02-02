import * as Express    from "express";
import * as Morgan     from "morgan";
import * as Helmet     from "helmet";
import * as Path       from "path";
import * as BodyParser from "body-parser";
import * as Cors       from "cors";

import ErrorHandler from "./errors/index";
import Logger from "../logger";

import API   from "./api/index";
import Emote from "./emote";

import { CORS_WHITELIST, PORT } from "../config";

const app = Express();

app.set("trust proxy", 1);
app.use(Helmet());
app.use(Cors((req, callback) => {
    const origin = req.header("Origin");
    if (!origin || CORS_WHITELIST.indexOf(origin) > -1) {
        callback(null, { origin: true });
    } else {
        callback(null, { origin: false });
    }
}));

app.use(Morgan("tiny"));
app.use(Express.static(Path.resolve("./public")));
app.use(BodyParser.json());
app.use("/v1", API);
app.use("/emote", Emote);

app.use(ErrorHandler);

app.listen(PORT, () => Logger.info(`Up and running on port ${PORT}`));
