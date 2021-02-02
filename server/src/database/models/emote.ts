import * as Mongoose from "mongoose";

import { TwitchUserDoc } from "./twitch-user";

export type EmoteType = "gif" | "image";

export enum EmoteStatus {
    PENDING  = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
};

export type Emote = {
    keyword   : string;
    type      : EmoteType;
    owner     : Mongoose.Types.ObjectId | TwitchUserDoc;
    status    : EmoteStatus[keyof EmoteStatus];
    isPrivate : boolean;
    userCount : number;
    createdAt : string;
    updatedAt : string;
};

export type EmoteDoc = Mongoose.Document & Emote;

const EmoteSchema: Mongoose.Schema<EmoteDoc> = new Mongoose.Schema({
    keyword: {
        type: String,
        unique: true,
        required: true,
    },
    status: {
        type    : String,
        enum    : [EmoteStatus.APPROVED, EmoteStatus.REJECTED, EmoteStatus.PENDING],
        default : EmoteStatus.APPROVED,
        index   : true,
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
    userCount: { type: Number, default: 1, required: true, index: true },
}, { timestamps: true });

const Emote = Mongoose.model<EmoteDoc>("emote", EmoteSchema);

export default Emote;
