import * as Mongoose from "mongoose";

import { TwitchUser } from "./twitch-user";

export type Token = {
    owner     : Mongoose.Types.ObjectId | TwitchUser;
    active    : boolean;
    token     : string;
    os        : string;
    browser   : string;
    ip        : string;
    createdAt : string;
    updatedAt : string;
};

export type TokenDoc = Mongoose.Document & Token;

const TokenSchema: Mongoose.Schema<TokenDoc> = new Mongoose.Schema({
    owner      : { type: Mongoose.Schema.Types.ObjectId, ref: "user", index: true },
    active     : { type: Boolean, default: true },
    token      : { type: String, index: true },
    os         : String,
    browser    : String,
    ip         : String,
}, { timestamps: true });

export default Mongoose.model<TokenDoc>("token", TokenSchema);
