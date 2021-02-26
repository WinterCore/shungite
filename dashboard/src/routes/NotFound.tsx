import React from "react";
import classnames from "classnames";
import { Typography } from "antd";

import us from "../util.module.css";

const NotFound: React.FC = () => {
    return (
        <section className={ classnames(us.flex, us.column, us.alignCenter, us.justifyCenter, us.fullpageContainer) }>
            <Typography.Title style={{ fontSize: 80 }} level={ 1 }>
                404
            </Typography.Title>
            <Typography.Title style={{ textAlign: "center", fontFamily: "Great Vibes" }} level={ 1 }>
                I am a man of fortune, and I must seek my fortune.
            </Typography.Title>
            <Typography.Title level={ 4 }>
                I don't think you're supposed to be here.
            </Typography.Title>
        </section>
    );
};

export default NotFound;
