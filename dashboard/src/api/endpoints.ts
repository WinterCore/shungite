import { AxiosRequestConfig as ARC } from "axios";

export const LOGIN = (): ARC => ({ method: "POST", url: "/auth/twitch" });
export const GET_EMOTES = (): ARC => ({ method: "GET", url: "/emotes" });
