import { AxiosRequestConfig as ARC } from "axios";

export const LOGIN               = (): ARC => ({ method: "POST", url: "/auth/twitch" });
export const LOGOUT              = (): ARC => ({ method: "POST", url: "/auth/logout" });
export const GET_EMOTES          = (): ARC => ({ method: "GET", url: "/emotes" });
export const GET_EMOTE           = (id: string): ARC => ({ method: "GET", url: `/emotes/${id}` });
export const CREATE_EMOTE        = (): ARC => ({ method: "POST", url: "/emotes" });
export const ADD_EMOTE           = (id: string): ARC => ({ method: "POST", url: `/emotes/${id}/own` });
export const DELETE_EMOTE        = (id: string): ARC => ({ method: "DELETE", url: `/emotes/${id}/own` });
export const GET_USER            = (id: string): ARC => ({ method: "GET", url: `/users/${id}` });
export const EMOTE_CHECK_KEYWORD = (): ARC => ({ method: "GET", url: "/emotes/keyword/check" });
