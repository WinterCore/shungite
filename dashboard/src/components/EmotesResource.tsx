import React from "react";
import classnames from "classnames";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router";
import { AxiosResponse } from "axios";
import { Select, Space, Row, Col } from "antd";

import Api, { GET_EMOTES } from "../api/index";
import { EmoteSnippet } from "../api/models";

import { GetEmotesResponse } from "../api/responses";
import ApiResourceRenderer from "./ResourceRenderer";

import EmoteCard from "./EmoteCard";

import us from "../util.module.css";

const Emotes: React.FC<EmotesProps> = ({ emotes }) => {
    return (
        <div className={ classnames(us.emotesGrid) }>
            { emotes.map(emote => <EmoteCard key={ emote.id } { ...emote } />) }
        </div>
    );
};

const Filter: React.FC = () => {
    const history = useHistory();
    const location = useLocation();

    const handleChange = (v: string) => history.push(`/emotes?sort=${v}`);

    const sort = queryString.parse(location.search).sort?.toString() || undefined;

    return (
        <Row justify="end">
            <Col>
                <Select
                    style={{ width: 160 }}
                    defaultValue={ sort }
                    placeholder="Please select"
                    onChange={ handleChange }
                >
                    <Select.Option value="-userCount">Most Popular</Select.Option>
                    <Select.Option value="userCount">Least Popular</Select.Option>
                    <Select.Option value="-createdAt">Newest First</Select.Option>
                    <Select.Option value="createdAt">Oldest First</Select.Option>
                </Select>
            </Col>
        </Row>
    );
};

const EmotesResource: React.FC<EmotesResourceProps> = () => {
    const [data, setData] = React.useState<EmoteSnippet[] | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);
    const location = useLocation();
    const sort = queryString.parse(location.search).sort?.toString() || undefined;

    React.useEffect(() => {
        const fetchEmotes = async () => {
            setIsLoading(true);
            const { data }: AxiosResponse<GetEmotesResponse> = await Api({
                ...GET_EMOTES(),
                params: { sort }
            });
            setData(data.data);
            setIsLoading(false);
        };

        fetchEmotes().catch(() => {
            setError("Something happened!");
            setIsLoading(false);
        });
    }, [sort]);

    return (
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Filter />
            <ApiResourceRenderer
                isLoading={ isLoading }
                error={ error }
                empty={ !!data && data.length === 0 }
                render={ () => <Emotes emotes={ data! } /> }
            />
        </Space>
    );
};

interface EmotesResourceProps {}
interface EmotesProps {
    emotes: EmoteSnippet[];
}

export default EmotesResource;
