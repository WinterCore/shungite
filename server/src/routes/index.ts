import * as Express    from "express";
import * as Morgan     from "morgan";
import * as Helmet     from "helmet";
import * as Path       from "path";
import * as BodyParser from "body-parser";

import ErrorHandler from "./errors/index";
import Logger from "../logger";

import API from "./api/index";

import { PORT } from "../config";

const app = Express();

app.use(Helmet());
app.set("trust proxy", 1);
app.use(Morgan("tiny"));
app.use(Express.static(Path.resolve("./public")));
app.use(BodyParser.json());
app.use("/v1", API);

app.use(ErrorHandler);

app.listen(PORT, () => Logger.info(`Up and running on port ${PORT}`));
