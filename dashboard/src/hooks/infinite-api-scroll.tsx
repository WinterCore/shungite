import React, { Reducer } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import equal from "deep-equal";

import Api from "../api/index";
import { getResponseError } from "../api/index";
import usePrevious from "./previous";

type InfiniteScrollState<T> = {
    page          : number;
    data          : null | T[];
    isLoading     : boolean;
    isLoadingMore : boolean;
    error         : null | string;
    moreError     : null | string;
    hasMore       : boolean;
};

const INITIAL_STATE = {
    page          : 1,
    data          : null,
    isLoading     : false,
    isLoadingMore : false,
    error         : null,
    hasMore       : false,
    moreError     : null,
};

enum ACTION_TYPES {
    LOAD_START       = "LOAD_START",
    LOAD_FINISH      = "LOAD_FINISH",
    LOAD_ERROR       = "LOAD_ERROR",
    LOAD_MORE_START  = "LOAD_MORE_START",
    LOAD_MORE_FINISH = "LOAD_MORE_FINISH",
    LOAD_MORE_ERROR  = "LOAD_MORE_ERROR",
};

type Action<T> =
    { type: ACTION_TYPES.LOAD_START }
    | { type: ACTION_TYPES.LOAD_FINISH, payload: T[] }
    | { type: ACTION_TYPES.LOAD_ERROR, payload: string }
    | { type: ACTION_TYPES.LOAD_MORE_START }
    | { type: ACTION_TYPES.LOAD_MORE_FINISH, payload: T[] }
    | { type: ACTION_TYPES.LOAD_MORE_ERROR, payload: string };

const reducer = <T, >(state: InfiniteScrollState<T> = INITIAL_STATE, action: Action<T>): InfiniteScrollState<T> => {
    switch (action.type) {
        case ACTION_TYPES.LOAD_START:
            return { page: 1, data: null, isLoading: true, isLoadingMore: false, error: null, hasMore: true, moreError: null };
        case ACTION_TYPES.LOAD_FINISH:
            return { page: 1, data: action.payload, isLoading: false, isLoadingMore: false, error: null, hasMore: true, moreError: null };
        case ACTION_TYPES.LOAD_ERROR:
            return { page: 1, data: null, isLoading: false, isLoadingMore: false, error: action.payload, hasMore: true, moreError: null };
        case ACTION_TYPES.LOAD_MORE_START:
            return { ...state, isLoadingMore: true };
        case ACTION_TYPES.LOAD_MORE_FINISH:
            const oldData = (state.data || []);
            return { ...state, page: state.page + 1, data: [...oldData, ...action.payload], isLoadingMore: false, hasMore: action.payload.length > 0 };
        case ACTION_TYPES.LOAD_MORE_ERROR:
            return { ...state, isLoadingMore: false, moreError: action.payload };
    }
};

type GetListFromResponse<T> = (data: unknown) => T[];

type UseInfiniteApiScrollArgs<T> = {
    parent   : HTMLDivElement | null;
    endpoint : AxiosRequestConfig;
    params   : Record<string, any>;
    getList  : GetListFromResponse<T>;
};

const useInfiniteApiScroll = <T, >({ parent, endpoint, params, getList }: UseInfiniteApiScrollArgs<T>): InfiniteScrollState<T> => {
    const [state, dispatch] = React.useReducer<Reducer<InfiniteScrollState<T>, Action<T>>>(reducer, INITIAL_STATE);
    const prevParams = usePrevious(params);

    const { page, isLoading, isLoadingMore, hasMore } = state;

    React.useEffect(() => {
        if (equal(params, prevParams)) return;

        const loadData = async () => {
            const rConfig = { ...endpoint, params };
            dispatch({ type: ACTION_TYPES.LOAD_START });

            try {
                const { data }: AxiosResponse<unknown> = await Api(rConfig);

                dispatch({ type: ACTION_TYPES.LOAD_FINISH, payload: getList(data) });
            } catch (e) {
                dispatch({ type: ACTION_TYPES.LOAD_ERROR, payload: getResponseError(e) });
            }
        };
        loadData();
    }, [params, prevParams, endpoint, getList]);

    React.useEffect(() => {
        const loadMoreData = async (page: number) => {
            const rConfig = { ...endpoint, params: { page, ...params } };
            dispatch({ type: ACTION_TYPES.LOAD_MORE_START });

            try {
                const { data }: AxiosResponse<unknown> = await Api(rConfig);

                dispatch({ type: ACTION_TYPES.LOAD_MORE_FINISH, payload: getList(data) });
            } catch (e) {
                dispatch({ type: ACTION_TYPES.LOAD_MORE_ERROR, payload: getResponseError(e) });
            }
        };

        const checkLoadMore = () => {
            console.log('scrolling', 'here');
            if (!parent) return;

            const { height, top } = parent.getBoundingClientRect();

            if (
                !isLoading
                && !isLoadingMore
                && (window.innerHeight - top) > height - 10
                && hasMore
            ) {
                loadMoreData(page + 1);
            }
        };

        window.addEventListener("scroll", checkLoadMore);
        return () => window.removeEventListener("scroll", checkLoadMore);
    }, [parent, page, params, isLoading, isLoadingMore, hasMore, endpoint, getList]);

    return state;
};

export default useInfiniteApiScroll;