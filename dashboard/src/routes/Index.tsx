import React from "react";

import { Typography } from "antd";


const Index: React.FC<IndexProps> = () => {
    return (
        <>
            <Typography.Title level={ 2 }>Welcome to Shungite</Typography.Title>
        </>
    );
};

interface IndexProps {}

export default Index;
