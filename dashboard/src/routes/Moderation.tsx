import React from "react";
import queryString from "query-string";
import classnames from "classnames";
import { RouteComponentProps } from "react-router-dom";

import { Space, Row, Col } from "antd";
import { GET_MOD_EMOTES } from "../api/index";

import us from "../util.module.css";
import EmotesResource from "../components/EmotesResource";
import QuerySelect from "../components/QuerySelect";
import { sortQuerySelectItems, statusQuerySelectItems } from "../util/helpers";

const Moderation: React.FC<ModerationProps> = ({ location }) => {
    const params = queryString.parse(location.search);
    const sort   = params.sort?.toString();
    const status = params.status?.toString();

    return (
        <section className={ classnames(us.flex, us.justifyCenter) }>
            <Space
                className={ us.responsiveContainer }
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
            >
                <Row justify="end">
                    <Col>
                        <QuerySelect
                            items={ statusQuerySelectItems }
                            queryKey="status"
                            placeholder="Status"
                            style={{ minWidth: 150 }}
                        />
                    </Col>
                    <Col>
                        <QuerySelect
                            items={ sortQuerySelectItems }
                            queryKey="sort"
                            placeholder="Sort"
                            style={{ minWidth: 150, marginLeft: 16 }}
                        />
                    </Col>
                </Row>
            <EmotesResource params={{ sort, status }} endpoint={ GET_MOD_EMOTES() } withStatus />
            </Space>
        </section>
    );
};

interface ModerationProps extends RouteComponentProps {}

export default Moderation;