import { User, EmoteSnippet, Emote } from "./models";

export interface SuccessResponse {
    message: string;
}

export interface LoginResponse {
    data  : User;
    token : string;
}

export interface GetEmotesResponse {
    data: EmoteSnippet[];
}

export interface GetEmoteDetailsResponse {
    data: Emote;
}
