import React from "react";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Row, Col, Typography, Tooltip, Button, notification } from "antd";
import { UserOutlined, CalendarOutlined, LineChartOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

import { Emote } from "../api/models";

import { formatDate } from "../util/helpers";
import { EMOTE_ASSET_URL, EmoteSize } from "../config";
import { useUser } from "../contexts/user";
import Api, { ADD_EMOTE, DELETE_EMOTE } from "../api/index";

import us from "../util.module.css";
import { SuccessResponse } from "../api/responses";

const EmoteActions: React.FC<EmoteProps> = (props) => {
    const { user } = useUser();
    const [added, setAdded] = React.useState<boolean>(props.added);
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleButtonClick = () => {
        if (loading) return;
        setLoading(true);
        Api(added ? DELETE_EMOTE(props.id) : ADD_EMOTE(props.id))
            .then(({ data: { message } }: AxiosResponse<SuccessResponse>) => {
                setAdded(!added);
                notification.success({ message });
                setLoading(false);
            }).catch((e) => {
                notification.error({
                    message: e.response ? e.response.data.message : "Something happened!"
                });
                setLoading(false);
            });
    };

    if (!user || props.owner.id === user.id) return null;

    return (
        <Row justify="center" style={{ marginTop: 50 }}>
            {added
                ? (
                    <Button
                        loading={ loading }
                        onClick={ handleButtonClick }
                        icon={ <MinusOutlined /> }
                        danger
                    >
                        Remove from Channel
                    </Button>
                )
                : (
                    <Button
                        loading={ loading }
                        onClick={ handleButtonClick }
                        icon={ <PlusOutlined /> }
                        type="primary"
                    >
                        Add to Channel
                    </Button>
                )
            }
        </Row>
    );
};

const EmoteResource: React.FC<EmoteProps> = (props) => {
    const { id, keyword, owner, user_count, created_at } = props;

    return (
        <Row justify="center">
            <Col className={ us.responsiveContainer }>
                <Typography.Title className={ us.textCenter } level={ 2 }>{ keyword }</Typography.Title>
                <Typography.Title className={ us.textCenter } level={ 5 }>
                    <Tooltip title="Owner">
                        <UserOutlined />
                        &nbsp;
                        <Link to="/users/#">{ owner.name }</Link>
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Tooltip title="Upload Date">
                        <CalendarOutlined />
                        &nbsp;
                        { formatDate(created_at) }
                    </Tooltip>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                    <Tooltip title="Channels">
                        <LineChartOutlined />
                        &nbsp;
                        { user_count.toLocaleString() }
                    </Tooltip>
                </Typography.Title>
                <Row justify="center" align="middle" style={{ marginTop: 50 }}>
                    {
                        (["x1", "x2", "x3"] as EmoteSize[]).map(s => (
                            <Col key={ s } style={{ margin: "0 10px" }}>
                                <img src={ EMOTE_ASSET_URL(id, s) } alt={ keyword } />
                            </Col>
                        ))
                    }
                </Row>
                <EmoteActions { ...props } />
            </Col>
        </Row>
    );
};


interface EmoteProps extends Emote {}

export default EmoteResource;
