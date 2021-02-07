import { AxiosRequestConfig as ARC } from "axios";

export const LOGIN        = (): ARC => ({ method: "POST", url: "/auth/twitch" });
export const GET_EMOTES   = (): ARC => ({ method: "GET", url: "/emotes" });
export const GET_EMOTE    = (id: string): ARC => ({ method: "GET", url: `/emotes/${id}` });
export const ADD_EMOTE    = (id: string): ARC => ({ method: "POST", url: `/emotes/${id}/own` });
export const DELETE_EMOTE = (id: string): ARC => ({ method: "DELETE", url: `/emotes/${id}/own` });
