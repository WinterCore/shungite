import Axios, { AxiosError } from "axios";

import { API_BASEURL } from "../config";
import { ErrorResponse } from "./responses";

export * from "./endpoints";

const Api = Axios.create({
    baseURL: API_BASEURL,
    headers: { Accept: "application/json" },
});

const token = window.localStorage.getItem("token") || "";

export const getResponseError = (e: AxiosError<ErrorResponse>): string => {
    if (!e.response) {
        console.log(e);
        return "Something happened";
    }

    if (e.response.status === 422) {
        const errors = (e.response.data as Required<ErrorResponse>).errors;
        const errorStr = Object.keys(errors).reduce((a, k) => {
            a.push(`${k}: ${errors[k]}`);
            return a;
        }, [] as string[]).join("<br />");

        return `Errors | ${errorStr}`;
    }

    return e.response.data.message;
};

Api.defaults.headers.common.Authorization = `Bearer ${token}`;

export default Api;
