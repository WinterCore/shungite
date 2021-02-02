import { Request } from "express";

import { ApiResource }   from "./index";
import { TwitchUserDoc } from "../../../database/models/twitch-user";

import { clean } from "./helpers";

const userResource: ApiResource<TwitchUserDoc> = (_: Request) => (user) => clean({
    id       : user._id,
    username : user.username,
    name     : user.name,
    picture  : user.picture,
});

export default userResource;
