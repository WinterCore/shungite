import React from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import Axios from "axios";

import Api from "../api/index";

function useApi<T>(config: AxiosRequestConfig, deps: any[] = []):
    { data: T | null, isLoading: boolean, error: string | null }
{
    const [data, setData]           = React.useState<T | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError]         = React.useState<string | null>(null);

    React.useEffect(() => {
        const cancelTokenSource = Axios.CancelToken.source();
        setIsLoading(true);
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
    }, deps);

    return { data, isLoading, error };
}

export default useApi;
