import { connect } from "mongoose";

import { MONGO_URL } from "../config";

connect(
    MONGO_URL,
    {
        useNewUrlParser    : true,
        useCreateIndex     : true,
        useUnifiedTopology : true,
        useFindAndModify   : false,
    }
);
