import { AxiosRequestConfig as ARC } from "axios";

export const LOGIN               = (): ARC => ({ method: "POST", url: "/auth/twitch" });
export const LOGOUT              = (): ARC => ({ method: "POST", url: "/auth/logout" });
export const GET_EMOTES          = (): ARC => ({ method: "GET", url: "/emotes" });
export const GET_MOD_EMOTES      = (): ARC => ({ method: "GET", url: "/emotes/mod" });
export const GET_EMOTE           = (keyword: string): ARC => ({ method: "GET", url: `/emotes/${keyword}` });
export const CREATE_EMOTE        = (): ARC => ({ method: "POST", url: "/emotes" });
export const ADD_EMOTE           = (id: string): ARC => ({ method: "POST", url: `/emotes/${id}/own` });
export const DELETE_EMOTE        = (id: string): ARC => ({ method: "DELETE", url: `/emotes/${id}/own` });
export const GET_OWN_EMOTES      = (): ARC => ({ method: "GET", url: "/emotes/own" })
export const GET_USER            = (username: string): ARC => ({ method: "GET", url: `/users/${username}` });
export const EMOTE_CHECK_KEYWORD = (): ARC => ({ method: "GET", url: "/emotes/keyword/check" });
export const APPROVE_EMOTE       = (id: string): ARC => ({ method: "POST", url: `/emotes/${id}/approve` });
export const REJECT_EMOTE        = (id: string): ARC => ({ method: "POST", url: `/emotes/${id}/reject` });
