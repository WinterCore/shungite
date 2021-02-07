import * as Mongoose from "mongoose";

import { TwitchUserDoc } from "./twitch-user";
import TwitchUserEmote from "./twitch-user-emote";

export type EmoteType = "gif" | "image";

export enum EmoteStatus {
    PENDING  = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
};

export type Emote = {
    keyword          : string;
    type             : EmoteType;
    owner            : Mongoose.Types.ObjectId | TwitchUserDoc;
    status           : EmoteStatus[keyof EmoteStatus];
    isPrivate        : boolean;
    userCount        : number;
    createdAt        : string;
    updatedAt        : string;
    rejectionReason ?: string;
    isAdded          : (userId: string) => Promise<boolean>;
    added           ?: boolean;
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
    rejectionReason : { type: String },
    userCount: { type: Number, default: 1, required: true, index: true },
}, { timestamps: true });

EmoteSchema.methods.isAdded = async function isAdded(userId: string): Promise<boolean> {
    console.log(this._id, userId);
    return await TwitchUserEmote.countDocuments({ emote: this._id, user: userId }) > 0;
};

const Emote = Mongoose.model<EmoteDoc>("emote", EmoteSchema);

export default Emote;
