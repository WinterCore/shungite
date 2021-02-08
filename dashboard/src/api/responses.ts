import { User, EmoteSnippet, Emote, UserDetails } from "./models";

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

export interface GetUserResponse {
    data: UserDetails;
}
