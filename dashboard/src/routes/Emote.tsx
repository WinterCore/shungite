import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ApiResourceRenderer from "../components/ResourceRenderer";

import { GET_EMOTE } from "../api/index";
import { GetEmoteDetailsResponse } from "../api/responses";

import EmoteResource from "../components/EmoteResource";

import useApi from "../hooks/api";

const Emote: React.FC<EmoteProps> = ({ match: { params } }) => {
    const { keyword } = params;
    const { data, error, isLoading } = useApi<GetEmoteDetailsResponse>(GET_EMOTE(keyword));

    return (
        <section>
            <ApiResourceRenderer
                isLoading={ isLoading }
                error={ error }
                render={ () => <EmoteResource { ...data!.data } /> }
            />
        </section>
    );
};

type Params = { keyword: string };

interface EmoteProps extends RouteComponentProps<Params> {}

export default Emote;
