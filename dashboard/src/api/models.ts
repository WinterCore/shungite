
export type EmoteType = "image" | "gif";
export type EmoteStatus = "APPROVED" | "PENDING" | "REJECTED";

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

export interface Emote extends EmoteSnippet {
    is_private       : boolean;
    owner            : User;
    status          ?: EmoteStatus;
    rejectionReason ?: string;
    added            : boolean;
}
