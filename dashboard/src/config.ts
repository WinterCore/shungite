import queryString from "query-string";

export type EmoteSize = "x1" | "x2" | "x3";

export const EMOTE_SIZES: { [key in EmoteSize]: number } = {
    x1: 28,
    x2: 56,
    x3: 112,
};

export const API_BASEURL = process.env.REACT_APP_API_BASEURL;
export const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
export const TWITCH_LOGIN_REDIRECT_URI = process.env.REACT_APP_TWITCH_LOGIN_REDIRECT_URI;
export const TWITCH_LOGIN_SCOPES = "user:read:email";
export const TWITCH_LOGIN_RESPONSE_TYPE = "code";
export const EMOTE_ASSET_BASEURL = process.env.REACT_APP_EMOTE_ASSET_BASEURL;
export const EMOTE_ASSET_URL = (id: string, size: EmoteSize) => `${EMOTE_ASSET_BASEURL}/${id}/${size}`;
export const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/authorize?" + queryString.stringify({
    client_id     : TWITCH_CLIENT_ID,
    redirect_uri  : TWITCH_LOGIN_REDIRECT_URI,
    response_type : TWITCH_LOGIN_RESPONSE_TYPE,
    scope         : TWITCH_LOGIN_SCOPES,
    force_verify  : true,
});
