import * as Path from "path";

const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "shungite";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "root";
const DB_CRED = DB_USER.length > 0 || DB_PASS.length > 0 ? `${DB_USER}:${DB_PASS}@` : "";


export const MONGO_URL = process.env.DB_URL || `mongodb://${DB_CRED}${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_CRED ? "?authSource=admin" : ""}`;

export const PORT = process.env.PORT || 8081;

export const FRONTEND_BASE_URI: string = process.env.FRONTEND_BASE_URI!;

export const JWT_SECRET: string    = process.env.JWT_SECRET!;
export const JWT_EXPIRE_IN: number = +(process.env.JWT_EXPIRE_IN || 604800000); // 5 days

export const TWITCH_CLIENT_ID: string     = process.env.TWITCH_CLIENT_ID!;
export const TWITCH_CLIENT_SECRET: string = process.env.TWITCH_CLIENT_SECRET!;

export const TWITCH_REDIRECT_URI  = `${FRONTEND_BASE_URI}/confirm-twitch-login`;

export const EMOTE_DIRECTORY = Path.resolve(process.cwd(), "storage/emotes");

export const CORS_WHITELIST = ["https://www.twitch.tv", "https://twitch.tv", "https://shungite.wintercore.dev"];

export type EmoteSize = "x1" | "x2" | "x3";
export type EmoteSizeObj<T> = { [key in EmoteSize] ?: T };

export const EMOTE_SIZES: EmoteSizeObj<number> = {
    x1: 28,
    x2: 56,
    x3: 112,
};
