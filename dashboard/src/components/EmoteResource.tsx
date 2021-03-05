import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Row, Col, Typography, Tooltip, Button, Tag, notification } from "antd";

import {
    UserOutlined,
    CalendarOutlined,
    LineChartOutlined,
    PlusOutlined,
    MinusOutlined
} from "@ant-design/icons";

import { Emote } from "../api/models";

import { formatDate, getTagColor } from "../util/helpers";
import { EMOTE_ASSET_URL, EmoteSize } from "../config";
import { useUser } from "../contexts/user";

import Api, { ADD_EMOTE, DELETE_EMOTE, getResponseError } from "../api/index";

import us from "../util.module.css";
import { SuccessResponse } from "../api/responses";

import "./EmoteResource.css";

const EmoteExtraInfo: React.FC<EmoteProps> = (props) => {
    const { owner, status, rejectionReason } = props;
    const { user } = useUser();

    if (!user || user.id !== owner.id) return null;

    return (
        <div className={ classnames(us.flex, us.alignCenter, us.column) } style={{ marginTop: 30 }}>
            <Typography.Title level={ 5 } className={ classnames(us.flex, us.alignCenter) }>
                Status: &nbsp;<Tag color={ getTagColor(status!) }>{ status }</Tag>
            </Typography.Title>
            { status === "rejected" && (
                <>
                    <Typography.Title level={ 5 }>
                        Rejection Reason
                    </Typography.Title>
                    <Typography.Text>{ rejectionReason }</Typography.Text>
                </>
            )}
        </div>
    );
};

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
                notification.error({ message: getResponseError(e) });
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
    const { id, keyword, owner, user_count, is_private, created_at } = props;

    return (

        <div className={ classnames(us.flex, us.justifyCenter) }>
            <Row justify="center" className={ classnames(us.responsiveContainer, "emote-details") }>
                <Col>
                    <Typography.Title className={ us.textCenter } level={ 2 }>{ keyword }</Typography.Title>
                    <Typography.Title className={ classnames(us.flex, us.justifyCenter, us.alignCenter, us.responsive, "info-items") } level={ 5 }>
                        <Tooltip title="Owner">
                            <UserOutlined />
                            &nbsp;
                            <Link to={ `/users/${owner.username}` }>{ owner.name }</Link>
                        </Tooltip>
                        <Tooltip title="Upload Date">
                            <CalendarOutlined />
                            &nbsp;
                            { formatDate(created_at) }
                        </Tooltip>
                        <Tooltip title="Channels">
                            <LineChartOutlined />
                            &nbsp;
                            { user_count.toLocaleString() }
                        </Tooltip>
                        <Tag style={{ marginLeft: 10 }} color={ is_private ? "red" : "green" }>{ is_private ? "Private" : "Public"}</Tag>
                    </Typography.Title>
                    <div className={ classnames(us.flex, us.justifyCenter, us.alignCenter, us.responsive, "images") } style={{ marginTop: 50 }}>
                        {
                            (["x1", "x2", "x3"] as EmoteSize[]).map(s => (
                                <div key={ s }>
                                    <img src={ EMOTE_ASSET_URL(id, s) } alt={ keyword } />
                                </div>
                            ))
                        }
                    </div>
                    <EmoteExtraInfo { ...props } />
                    <EmoteActions { ...props } />
                </Col>
            </Row>
        </div>
    );
};


interface EmoteProps extends Emote {}

export default EmoteResource;
