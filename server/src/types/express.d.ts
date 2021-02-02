declare namespace Express {
    export interface Request {
        user: import("../database/models/twitch-user").TwitchUserDoc | null;
    }
}