import { EmoteDoc, EmoteStatus } from "../../../database/models/emote";
import { TwitchUserDoc }         from "../../../database/models/twitch-user";

import { ApiResource } from "./index";

import userResource from "./user";

import { clean } from "./helpers";

const emoteResource: ApiResource<EmoteDoc> = (req) => (emote) => clean({
    id         : emote._id,
    keyword    : emote.keyword,
    type       : emote.type,
    user_count : emote.userCount,
    owner      : emote.populated("owner") ? userResource(req)(emote.owner as TwitchUserDoc) : null,
    created_at : emote.createdAt,
});

export const emoteDetailsResource: ApiResource<EmoteDoc> = (req) => (emote) => {
    const owner = emote.owner as TwitchUserDoc;
    if (!owner._id.equals(req.user!.id)) emoteResource(req)(emote);

    const extraData = {
        is_private      : emote.isPrivate,
        status          : emote.status,
        rejectionReason : emote.status === EmoteStatus.REJECTED ? emote.rejectionReason : undefined,
    };

    return {
        ...emoteResource(req)(emote),
        ...clean(extraData),
    };
};

export default emoteResource;
