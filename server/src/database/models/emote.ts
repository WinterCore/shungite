import * as Mongoose from "mongoose";

import { TwitchUser } from "./twitch-user";

const EmoteSchema: Mongoose.Schema = new Mongoose.Schema({
    keyword    : { type: String, unique: true, required: true },
    timestamps : {},
    type       : {
        type     : String,
        enum     : ["gif", "image"],
        required : true,
    },
    owner : {
        type     : Mongoose.Schema.Types.ObjectId,
        ref      : "user",
        required : true,
        index    : true
    },
});

export type Emote = {
    keyword : string;
    type    : "gif" | "image";
    owner   : TwitchUser | string;
};

export type EmoteDoc = Mongoose.Document & Emote;

export default Mongoose.model<EmoteDoc>("emote", EmoteSchema);
