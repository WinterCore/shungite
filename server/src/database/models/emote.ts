import * as Mongoose from "mongoose";

import { TwitchUser } from "./twitch-user";

const EmoteSchema: Mongoose.Schema = new Mongoose.Schema({
    keyword: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type    : String,
        enum    : ["pending", "approved", "rejected"],
        default : "pending",
    },
    type: {
        type     : String,
        enum     : ["gif", "image"],
        required : true,
    },
    isPrivate: {
        type     : Boolean,
        required : true,
    },
    owner: {
        type     : Mongoose.Schema.Types.ObjectId,
        ref      : "user",
        required : true,
        index    : true
    },
    timestamps : {},
});

export type EmoteType = "gif" | "image";

export type Emote = {
    keyword   : string;
    type      : EmoteType;
    owner     : TwitchUser | string;
    status    : "pending" | "approved" | "rejected";
    isPrivate : boolean;
};

export type EmoteDoc = Mongoose.Document & Emote;

export default Mongoose.model<EmoteDoc>("emote", EmoteSchema);
