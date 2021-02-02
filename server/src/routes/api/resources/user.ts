import { TwitchUserDoc } from "../../../database/models/twitch-user";

import { clean } from "./helpers";

const userResource = (user: TwitchUserDoc) => clean({
    id       : user._id,
    username : user.username,
    name     : user.name,
    picture  : user.picture,
});

export default userResource;
