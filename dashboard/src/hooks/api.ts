import React from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Axios from "axios";

import Api from "../api/index";

function useApi<T>(config: AxiosRequestConfig, deps: any[] = [], disableLoadingOnReload: boolean = false):
    { data: T | null, isLoading: boolean, error: string | null, reload: () => void }
{
    const [data, setData]           = React.useState<T | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError]         = React.useState<string | null>(null);
    const [random, setRandom]       = React.useState<number>(Math.random());

    const reload = () => setRandom(Math.random());

    React.useEffect(() => {
        const cancelTokenSource = Axios.CancelToken.source();
        if (!disableLoadingOnReload) setIsLoading(true);
        setError(null);
        Api({ ...config, cancelToken : cancelTokenSource.token })
            .then(({ data }: AxiosResponse<T>) => {
                setData(data);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err.message !== "CANCELED") {
                    setError("Something happened!");
                    setIsLoading(false);
                }
            });
        return () => cancelTokenSource.cancel("CANCELED");
    /* eslint-disable react-hooks/exhaustive-deps */
    }, [...deps, random]);
    /* eslint-enable react-hooks/exhaustive-deps */

    return { data, isLoading, error, reload };
}

export default useApi;
