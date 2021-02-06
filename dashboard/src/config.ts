import queryString from "query-string";

export const API_BASEURL = process.env.REACT_APP_API_BASEURL;
export const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;
export const TWITCH_LOGIN_REDIRECT_URI = process.env.REACT_APP_TWITCH_LOGIN_REDIRECT_URI;
export const TWITCH_LOGIN_SCOPES = "user:read:email";
export const TWITCH_LOGIN_RESPONSE_TYPE = "code";
export const TWITCH_AUTH_URL = "https://id.twitch.tv/oauth2/authorize?" + queryString.stringify({
    client_id     : TWITCH_CLIENT_ID,
    redirect_uri  : TWITCH_LOGIN_REDIRECT_URI,
    response_type : TWITCH_LOGIN_RESPONSE_TYPE,
    scope         : TWITCH_LOGIN_SCOPES
});
