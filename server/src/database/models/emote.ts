import * as Mongoose from "mongoose";

const EmoteSchema: Mongoose.Schema = new Mongoose.Schema({
    keyword    : { type: String, unique: true, required: true },
    timestamps : {},
    type       : {
        type     : String,
        enum     : ["gif", "image"],
        required : true,
    },
    owner : {
        type  : Mongoose.Schema.Types.ObjectId,
        ref   : "user",
        index : true
    },
});

export default Mongoose.model("emote", EmoteSchema);
