import React from "react";
import classnames from "classnames";
import queryString from "query-string";
import { RouteComponentProps } from "react-router-dom";

import { Space, Select, Row, Col } from "antd";

import EmotesResource from "../components/EmotesResource";
import { GET_EMOTES } from "../api/index";

import us from "../util.module.css";

const Emotes: React.FC<EmotesProps> = ({ location, history }) => {
    const sort = queryString.parse(location.search).sort?.toString() || undefined;

    const handleChange = (v: string) => history.replace(`/emotes?sort=${v}`);

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
                        <Select
                            style={{ minWidth: 160 }}
                            value={ sort }
                            placeholder="Sort"
                            onChange={ handleChange }
                        >
                            <Select.Option value="-userCount">Most Popular</Select.Option>
                            <Select.Option value="userCount">Least Popular</Select.Option>
                            <Select.Option value="-createdAt">Newest First</Select.Option>
                            <Select.Option value="createdAt">Oldest First</Select.Option>
                        </Select>
                    </Col>
                </Row>
                <EmotesResource sort={ sort } endpoint={ GET_EMOTES() } />
            </Space>
        </section>
    );
};


interface EmotesProps extends RouteComponentProps {}

export default Emotes;
