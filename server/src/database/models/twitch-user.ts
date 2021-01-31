import * as Mongoose from "mongoose";

const TwitchUserSchema: Mongoose.Schema = new Mongoose.Schema({
    twitchId      : { type: String, unique: true },
    username      : { type: String, unique: true },
    name          : String,
    email         : { type: String, unique: true },
    picture       : String,
    channelEmotes : [{ type: Mongoose.Schema.Types.ObjectId, ref: "emote" }],
});

export type TwitchUser = {
    twitchId      : string;
    username      : string;
    name          : string;
    email         : string;
    picture       : string;
    channelEmotes : string[];
};

export type TwitchUserDoc = Mongoose.Document<TwitchUser>;


export default Mongoose.model<TwitchUserDoc>("user", TwitchUserSchema);
