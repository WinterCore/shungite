import React from "react";
import classnames from "classnames";
import queryString from "query-string";
import { RouteComponentProps } from "react-router-dom";

import { Space, Row, Col } from "antd";

import EmotesResource from "../components/EmotesResource";
import QuerySelect from "../components/QuerySelect";
import { GET_EMOTES } from "../api/index";

import us from "../util.module.css";
import { sortQuerySelectItems } from "../util/helpers";

const Emotes: React.FC<EmotesProps> = ({ location }) => {
    const sort = queryString.parse(location.search).sort?.toString();

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
                            items={ sortQuerySelectItems }
                            queryKey="sort"
                            placeholder="Sort"
                            style={{ minWidth: 150 }}
                        />
                    </Col>
                </Row>
                <EmotesResource sort={ sort } endpoint={ GET_EMOTES() } />
            </Space>
        </section>
    );
};


interface EmotesProps extends RouteComponentProps {}

export default Emotes;
