import React from "react";
import classnames from "classnames";
import { Link } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Row, Col, Typography, Tooltip, Button, Form, Tag, notification, Input } from "antd";

import {
    UserOutlined,
    CalendarOutlined,
    LineChartOutlined,
    PlusOutlined,
    MinusOutlined,
    CheckOutlined,
    CloseOutlined,
} from "@ant-design/icons";

import { formatDate, getTagColor } from "../util/helpers";
import { EMOTE_ASSET_URL, EmoteSize } from "../config";
import { useUser } from "../contexts/user";

import Api, { ADD_EMOTE, DELETE_EMOTE, APPROVE_EMOTE, REJECT_EMOTE, getResponseError } from "../api/index";

import us from "../util.module.css";
import { SuccessResponse } from "../api/responses";

import "./EmoteResource.css";
import { useEmote } from "../contexts/emote";
import { EmoteStatus } from "../api/models";

const EmoteExtraInfo: React.FC<EmoteProps> = (props) => {
    const { user } = useUser();
    const { emote } = useEmote();
    const { owner, status, rejectionReason } = emote;

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

const EmoteActions: React.FC<EmoteProps> = () => {
    const { user } = useUser();
    const { emote, update } = useEmote();
    const [loading, setLoading] = React.useState<boolean>(false);

    const handleButtonClick = () => {
        if (loading) return;
        setLoading(true);
        Api(emote.added ? DELETE_EMOTE(emote.id) : ADD_EMOTE(emote.id))
            .then(({ data: { message } }: AxiosResponse<SuccessResponse>) => {
                update({ added: !emote.added });
                notification.success({ message });
                setLoading(false);
            }).catch((e) => {
                notification.error({ message: getResponseError(e) });
                setLoading(false);
            });
    };

    if (!user || emote.owner.id === user.id) return null;

    return (
        <Row justify="center" style={{ marginTop: 50 }}>
            {emote.added
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

const EmoteModActions: React.FC = () => {
    const { user }              = useUser();
    const { emote, update }     = useEmote();
    const [form]                = Form.useForm();
    const [loading, setLoading] = React.useState<boolean>(false);

    if (emote.status !== "pending" || !user || !user.isAdmin) return null;

    const changeStatus = (status: EmoteStatus) => {
        return () => {
            if (loading) return;
            setLoading(true);
            const reason = form.getFieldValue("reason");
            Api({ ...(status === "approved" ? APPROVE_EMOTE(emote.id) : REJECT_EMOTE(emote.id)), data: { reason } })
                .then(({ data: { message } }: AxiosResponse<SuccessResponse>) => {
                    update({ status, rejectionReason: reason });
                    notification.success({ message });
                    setLoading(false);
                }).catch((e) => {
                    notification.error({ message: getResponseError(e) });
                    setLoading(false);
                });
        };
    };

    return (
        <div className={ classnames(us.flex, us.column, us.alignCenter) } style={{ marginTop: 50 }}>
            <div className={ classnames(us.flex) }>
                <Form form={ form } onFinish={ changeStatus("rejected") }>
                    <Form.Item
                        name="reason"
                        style={{ margin: 0, display: "inline-block" }}
                        rules={[
                            { required: true, message: "This field is required" },
                        ]}
                    >
                        <Input placeholder="Rejection Reason" />
                    </Form.Item>

                    <Button
                        icon={ <CloseOutlined /> }
                        type="primary"
                        disabled={ loading }
                        onClick={ form.submit }
                        danger
                    >
                        Reject
                    </Button>
                </Form>
                <Button
                    icon={ <CheckOutlined /> }
                    type="primary"
                    disabled={ loading }
                    onClick={ changeStatus("approved") }
                >
                    Approve
                </Button>
            </div>
        </div>
    );
};

const EmoteResource: React.FC<EmoteProps> = (props) => {
    const { emote } = useEmote();
    const { keyword, owner, user_count, is_private, created_at } = emote;

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
                                    <img src={ EMOTE_ASSET_URL(keyword, s) } alt={ keyword } />
                                </div>
                            ))
                        }
                    </div>
                    <EmoteExtraInfo />
                    <EmoteActions />
                    <EmoteModActions />
                </Col>
            </Row>
        </div>
    );
};


interface EmoteProps {}

export default EmoteResource;
