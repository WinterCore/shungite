import Axios from "axios";

import { API_BASEURL } from "../config";

export * from "./endpoints";

const Api = Axios.create({
    baseURL: API_BASEURL,
    headers: { Accept: "application/json" },
});

const token = window.localStorage.getItem("token") || "";

Api.defaults.headers.common.Authorization = `Bearer ${token}`;

export default Api;
