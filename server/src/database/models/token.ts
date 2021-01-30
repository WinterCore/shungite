import * as Mongoose from "mongoose";

const TokenSchema = new Mongoose.Schema({
    owner      : { type: Mongoose.Schema.Types.ObjectId, ref: "user" },
    timestamps : {},
    active     : Boolean,
    token      : String,
    os         : String,
    browser    : String,
    ip         : String,
});

export default Mongoose.model("token", TokenSchema);
