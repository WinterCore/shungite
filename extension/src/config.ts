
export type EmoteSize = "x1" | "x2" | "x3";
export const EMOTE_SIZES: EmoteSize[] = ["x1", "x2", "x3"];
export const EMOTE_URL = (id: string, size: EmoteSize) => `https://cdn.shungite.upperdown.me/emote/${id}/${size}`;
export const EMOTE_API_URL = "https://api.shungite.upperdown.me/v1";
export const GET_CHANNEL_EMOTES_URL = (username: string) => `${EMOTE_API_URL}/users/${username}`;
