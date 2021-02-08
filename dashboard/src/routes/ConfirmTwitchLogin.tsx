import React from "react";
import queryString from "query-string";
import { AxiosResponse } from "axios";
import { RouteComponentProps } from "react-router-dom";

import Api, { LOGIN } from "../api/index";
import { LoginResponse } from "../api/responses";

import { Spin, Row, Col, Typography } from "antd";

import { useUser } from "../contexts/user";

const ConfirmTwitchLogin: React.FC<ConfirmTwitchLoginProps> = ({ location, history }) => {
    const [error, setError] = React.useState<boolean>(false);
    const { login } = useUser();

    React.useEffect(() => {
        const { code } = queryString.parse(location.search);
        if (!code) return history.push("/");

        const tryLogin = async () => {
            const { data }: AxiosResponse<LoginResponse> = await Api({ ...LOGIN(), data: { code } });
            login(data.data, data.token);
            history.push("/");
        };

        tryLogin().catch(() => setError(true));
    }, [history, location.search, login]);

    return (
        <Row justify="center" style={{ margin: "50px 0" }}>
            <Col>
                {
                    error
                        ? <Typography.Title level={4} type="danger">Something happened!</Typography.Title>
                        : <Spin size="large" tip="Confirming your login..." />
                }
            </Col>
        </Row>
    );
};

interface ConfirmTwitchLoginProps extends RouteComponentProps {
}

export default ConfirmTwitchLogin;
