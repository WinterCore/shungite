import Axios from "axios";

import Logger from "../../logger";

import {
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
    TWITCH_REDIRECT_URI,
} from "../../config";

export type TokenResponse = {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    scope: string[];
    token_type: string;
};

export type UserData = {
    id                : string;
    login             : string;
    display_name      : string;
    profile_image_url : string;
    email             : string;
};

export const getToken = async (code: string): Promise<TokenResponse> => {
    try {
        const { data } = await Axios.post<TokenResponse>(
            "https://id.twitch.tv/oauth2/token",
            null,
            {
                params: {
                    code,
                    client_id     : TWITCH_CLIENT_ID,
                    client_secret : TWITCH_CLIENT_SECRET,
                    grant_type    : "authorization_code",
                    redirect_uri  : TWITCH_REDIRECT_URI,
                }
            }
        );
        return data;
    } catch(e) {
        Logger.error("Twitch api getToken error info: %O", {
            data: e.response.data,
        });
        throw new Error(e);
    }
};

export const getUserData = async (token: string): Promise<UserData> => {
    try {
        const { data: { user_id } } = await Axios.get<{ user_id: string }>(
            "https://id.twitch.tv/oauth2/validate",
            { headers: { Authorization: `Bearer ${token}` } }
        );

        const { data: { data: [user] } } = await Axios.get<{ data: UserData[] }>(
            "https://api.twitch.tv/helix/users",
            {
                params  : { id: user_id },
                headers : {
                    Authorization : `Bearer ${token}`,
                    "client-id"   : TWITCH_CLIENT_ID,
                },
            }
        );

        return user;
    } catch(e) {
        Logger.error("Twitch api getUserData error info: %O", {
            data: e.response.data,
        });
        throw new Error(e);
    }
};
