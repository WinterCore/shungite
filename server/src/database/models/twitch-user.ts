import * as Mongoose from "mongoose";
import TwitchUserEmote from "./twitch-user-emote";
import Emote, { EmoteDoc, EmoteStatus } from "./emote";

export type TwitchUser = {
    twitchId       : string;
    username       : string;
    name           : string;
    email          : string;
    picture        : string;
    publicEmotes   : () => Promise<EmoteDoc[]>;
    uploadedEmotes : () => Promise<EmoteDoc[]>;
};

export type TwitchUserDoc = TwitchUser & Mongoose.Document;

const TwitchUserSchema: Mongoose.Schema<TwitchUserDoc> = new Mongoose.Schema({
    twitchId  : { type: String, unique: true, required: true, index: true },
    username  : { type: String, unique: true, required: true, index: true },
    name      : { type: String, required: true },
    email     : { type: String, unique: true, required: true },
    picture   : { type: String, required: true },
});

TwitchUserSchema.methods.publicEmotes = async function publicEmotes(this: TwitchUserDoc): Promise<EmoteDoc[]> {
    const publicEmotesIds: string[] = (await TwitchUserEmote.find({ user: this._id }, { emote: 1 }))
        .map(doc => doc.emote.toString());

    return Emote.find({ isPrivate: false, status: EmoteStatus.APPROVED, _id: { $in: publicEmotesIds } });
};

TwitchUserSchema.methods.uploadedEmotes = async function privateEmotes(this: TwitchUserDoc): Promise<EmoteDoc[]> {
    return Emote.find({ status: EmoteStatus.APPROVED, owner: this._id })
};

export default Mongoose.model<TwitchUserDoc>("user", TwitchUserSchema);
