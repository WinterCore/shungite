import * as Mongoose from "mongoose";

const TwitchUserSchema: Mongoose.Schema = new Mongoose.Schema({
    twitchId      : { type: String, unique: true },
    username      : { type: String, unique: true },
    name          : String,
    email         : { type: String, unique: true },
    picture       : String,
    channelEmotes : [{ type: Mongoose.Schema.Types.ObjectId, ref: "emote" }],
});

export default Mongoose.model("user", TwitchUserSchema);
