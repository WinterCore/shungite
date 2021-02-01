import { TwitchUserDoc } from "../../../database/models/twitch-user";

const userResource = (user: TwitchUserDoc) => ({
    id       : user._id,
    username : user.username,
    name     : user.name,
    picture  : user.picture,
});

export default userResource;
