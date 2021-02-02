import * as Mongoose from "mongoose";

import { EmoteDoc }      from "./emote";
import { TwitchUserDoc } from "./twitch-user";

type TwitchUserEmote = {
    user      : Mongoose.Types.ObjectId | TwitchUserDoc;
    emote     : Mongoose.Types.ObjectId | EmoteDoc;
    createdAt : string;
    updatedAt : string;
};

type TwitchUserEmoteDoc = Mongoose.Document & TwitchUserEmote;

const TwitchUserEmoteSchema: Mongoose.Schema<TwitchUserEmoteDoc> = new Mongoose.Schema({
    user  : { type: Mongoose.Types.ObjectId, required: true },
    emote : { type: Mongoose.Types.ObjectId, required: true },
}, { timestamps: true });

const TwitchUserEmote = Mongoose.model<TwitchUserEmoteDoc>("twitchUserEmote", TwitchUserEmoteSchema);

export default TwitchUserEmote;
