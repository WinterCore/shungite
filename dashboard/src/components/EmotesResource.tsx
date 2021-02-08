import React from "react";
import { AxiosResponse } from "axios";
import classnames from "classnames";
import queryString from "query-string";
import { useHistory, useLocation } from "react-router";
import { Select, Space, Row, Col, notification } from "antd";

import { getResponseError, GET_EMOTES } from "../api/index";
import { EmoteSnippet } from "../api/models";

import { GetEmotesResponse } from "../api/responses";
import ApiResourceRenderer from "./ResourceRenderer";
import Api from "../api/index";

import EmoteCard from "./EmoteCard";


import us from "../util.module.css";
import Loader from "./Loader";

export const Emotes: React.FC<EmotesProps> = ({ emotes }) => {
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
    const location = useLocation();
    const [page, setPage] = React.useState<number>(1);
    const [data, setData] = React.useState<EmoteSnippet[] | null>();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = React.useState<boolean>(false);
    const [error, setError] = React.useState<string | null>(null);
    const [hasMore, setHasMore] = React.useState<boolean>(true);
    const sort = queryString.parse(location.search).sort?.toString() || undefined;
    const containerRef = React.useRef<HTMLDivElement>(null);

    const loadMoreData = async (page: number) => {
        const rConfig = { ...GET_EMOTES(), params: { sort, page } };
        setIsLoadingMore(true);

        try {
            const { data }: AxiosResponse<GetEmotesResponse> = await Api(rConfig);

            setData(oldData => [...oldData!, ...data.data]);
            setHasMore(data.data.length === 30);
            setIsLoadingMore(false);
        } catch (e) {
            setIsLoadingMore(false);
            notification.error({ message: getResponseError(e) });
        }
    };

    React.useEffect(() => {
        const loadData = async () => {
            const rConfig = { ...GET_EMOTES(), params: { sort } };
            setIsLoading(true);
            setPage(1);
            setHasMore(true);

            try {
                const { data }: AxiosResponse<GetEmotesResponse> = await Api(rConfig);

                setData(data.data);
                setHasMore(data.data.length === 30);
                setIsLoading(false);
            } catch (e) {
                setError(getResponseError(e));
            }
        };
        loadData();
    }, [sort]);

    const checkLoadMore = () => {
        const container = containerRef.current;
        if (!container) return;

        const { height, top } = container.getBoundingClientRect();

        if (
           !isLoading
           && !isLoadingMore
           && (window.innerHeight - top) > height - 10
           && hasMore
        ) {
            loadMoreData(page + 1);
            setPage(page => page + 1);
        }
    };

    React.useEffect(() => {
        window.addEventListener("scroll", checkLoadMore);
        return () => window.removeEventListener("scroll", checkLoadMore);
    });

    return (
        <div ref={ containerRef } className={ classnames(us.flex, us.justifyCenter) }>
            <Space
                className={ classnames(us.responsiveContainer) }
                direction="vertical"
                size="large"
                style={{ width: "100%" }}
            >
                <Filter />
                <ApiResourceRenderer
                    isLoading={ isLoading || !data }
                    error={ error }
                    empty={ !!data && data.length === 0 }
                    render={ () => <Emotes emotes={ data! } /> }
                />
                { isLoadingMore && <Loader /> }
            </Space>
        </div>
    );
};

interface EmotesResourceProps {}
interface EmotesProps {
    emotes: EmoteSnippet[];
}

export default EmotesResource;
