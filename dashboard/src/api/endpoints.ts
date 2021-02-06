import { AxiosRequestConfig as ARC } from "axios";

export const LOGIN = (): ARC => ({ method: "POST", url: "/auth/twitch" });
