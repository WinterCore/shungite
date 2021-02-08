import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Row, Col, Typography, Empty, Space } from "antd";

import { Emotes } from "../components/EmotesResource";
import ApiResourceRenderer from "../components/ResourceRenderer";

import { GET_USER } from "../api/index";
import { GetUserResponse } from "../api/responses";
import { UserDetails } from "../api/models";


import useApi from "../hooks/api";
import us from "../util.module.css";

const Users: React.FC<UserDetails> = (props) => {
    const { name, public_emotes, uploaded_emotes } = props;

    return (
        <Row justify="center">
            <Col className={ us.responsiveContainer }>
                <Typography.Title className={ us.textCenter } level={ 2 }>{ name }</Typography.Title>
                <div style={{ marginTop: 50 }}>
                    <Typography.Title level={ 4 }>Public Emotes</Typography.Title>
                    {public_emotes.length
                        ? <Emotes emotes={ public_emotes } />
                        : <Empty />
                    }
                </div>
                <div style={{ marginTop: 50 }}>
                    <Typography.Title level={ 4 }>Uploaded Emotes</Typography.Title>
                    {uploaded_emotes.length
                        ? <Emotes emotes={ uploaded_emotes } />
                        : <Empty />
                    }
                </div>
            </Col>
        </Row>
    );
};

const UsersRenderer: React.FC<UsersProps> = ({ match: { params } }) => {
    const { username } = params;
    const { data, error, isLoading } = useApi<GetUserResponse>(GET_USER(username));

    return (
        <ApiResourceRenderer
            isLoading={ isLoading }
            error={ error }
            render={ () => <Users { ...data!.data } /> }
        />
    );
};

type Params = { username: string };

interface UsersProps extends RouteComponentProps<Params> {}

export default UsersRenderer;
