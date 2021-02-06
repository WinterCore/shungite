import { User, EmoteSnippet } from "./models";


export interface LoginResponse {
    data  : User;
    token : string;
}

export interface GetEmotesResponse {
    data : EmoteSnippet[];
}
