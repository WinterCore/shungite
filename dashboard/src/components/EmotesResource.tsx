import React from "react";
import { AxiosRequestConfig } from "axios";
import classnames from "classnames";

import { EmoteSnippet } from "../api/models";

import { GetEmotesResponse } from "../api/responses";
import ApiResourceRenderer from "./ResourceRenderer";
import useInfiniteApiScroll from "../hooks/infinite-api-scroll";

import EmoteCard from "./EmoteCard";


import us from "../util.module.css";
import Loader from "./Loader";

export const Emotes: React.FC<EmotesProps> = ({ emotes, withStatus = false }) => {
    return (
        <div className={ classnames(us.emotesGrid) }>
            { emotes.map(emote => <EmoteCard key={ emote.id } { ...emote } withStatus={ withStatus } />) }
        </div>
    );
};

const getList = (data: unknown): EmoteSnippet[] => (data as GetEmotesResponse).data;

const EmotesResource: React.FC<EmotesResourceProps> = ({ params = {}, endpoint, withStatus = false }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { isLoading, data, error, isLoadingMore } = useInfiniteApiScroll<EmoteSnippet>({ params, parent: containerRef.current, endpoint, getList });

    return (
        <div ref={ containerRef }>
            <ApiResourceRenderer
                isLoading={ isLoading || !data }
                error={ error }
                empty={ !!data && data.length === 0 }
                render={ () => <Emotes emotes={ data! } withStatus={ withStatus } /> }
            />
            { isLoadingMore && <Loader /> }
        </div>
    );
};

interface EmotesResourceProps {
    params     ?: Record<string, string | undefined>;
    withStatus ?: boolean;
    endpoint    : AxiosRequestConfig;
}
interface EmotesProps {
    emotes      : EmoteSnippet[];
    withStatus ?: boolean;
}

export default EmotesResource;
