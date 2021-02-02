import { EmoteDoc } from "../../../database/models/emote";
import { TwitchUserDoc } from "../../../database/models/twitch-user";

import userResource from "./user";

import { clean } from "./helpers";

const emoteResource = (emote: EmoteDoc) => clean(({
    id         : emote._id,
    keyword    : emote.keyword,
    type       : emote.type,
    user_count : emote.userCount,
    owner      : emote.populated("owner") ? userResource(emote.owner as TwitchUserDoc) : null,
    created_at : emote.createdAt,
}));

export default emoteResource;
