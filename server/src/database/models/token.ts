import * as Mongoose from "mongoose";

import { TwitchUser } from "./twitch-user";

const TokenSchema = new Mongoose.Schema({
    owner      : { type: Mongoose.Schema.Types.ObjectId, ref: "user" },
    timestamps : {},
    active     : { type: Boolean, default: true },
    token      : String,
    os         : String,
    browser    : String,
    ip         : String,
});

export type Token = {
    owner   : TwitchUser | string;
    active  : boolean;
    token   : string;
    os      : string;
    browser : string;
    ip      : string;
};

export type TokenDoc = Mongoose.Document<Token>;

export default Mongoose.model<TokenDoc>("token", TokenSchema);
