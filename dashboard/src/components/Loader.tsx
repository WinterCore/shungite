import React from "react";

import { Row, Col, Spin } from "antd";

import getLoadingMessage from "../util/loading-messages";

const Loader: React.FC = () => {
    const [loadingMessage] = React.useState<string>(() => getLoadingMessage());

    return (
        <Row justify="center" style={{ margin: "50px 0" }}>
            <Col>
                <Spin size="large" tip={ loadingMessage } />
            </Col>
        </Row>
    );
};

export default Loader;
