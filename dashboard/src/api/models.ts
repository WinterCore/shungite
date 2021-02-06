
export type EmoteType = "image" | "gif";

export interface User {
    id       : string;
    username : string;
    name     : string;
    picture  : string;
}

export interface EmoteSnippet {
    id         : string;
    keyword    : string;
    type       : EmoteType;
    user_count : number;
    created_at : string;
}
