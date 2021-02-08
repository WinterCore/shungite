
export type EmoteType = "image" | "gif";
export type EmoteStatus = "approved" | "pending" | "rejected";

export interface User {
    id       : string;
    username : string;
    name     : string;
    picture  : string;
}

export interface UserDetails extends User {
    uploaded_emotes : EmoteSnippet[];
    public_emotes   : EmoteSnippet[];
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
