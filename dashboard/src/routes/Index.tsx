import React from "react";
import classnames from "classnames";

import { Typography } from "antd";

import us from "../util.module.css";

const Index: React.FC<IndexProps> = () => {
    return (
        <div className={ classnames(us.flex, us.alignCenter, us.justifyCenter, us.fullpageContainer) }>
            <Typography.Title level={ 2 }>Welcome to Shungite</Typography.Title>
        </div>
    );
};

interface IndexProps {}

export default Index;
