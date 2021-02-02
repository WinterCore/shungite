import * as Mongoose from "mongoose";

const TwitchUserSchema: Mongoose.Schema = new Mongoose.Schema({
    twitchId      : { type: String, unique: true, required: true },
    username      : { type: String, unique: true, required: true },
    name          : { type: String, required: true },
    email         : { type: String, unique: true, required: true },
    picture       : { type: String, required: true },
    channelEmotes : {
        type    : [{ type: Mongoose.Schema.Types.ObjectId, ref: "emote" }],
        index   : true,
        default : [],
    },
});

export type TwitchUser = {
    twitchId      : string;
    username      : string;
    name          : string;
    email         : string;
    picture       : string;
    channelEmotes : string[];
};

export type TwitchUserDoc = TwitchUser & Mongoose.Document;

export default Mongoose.model<TwitchUserDoc>("user", TwitchUserSchema);
