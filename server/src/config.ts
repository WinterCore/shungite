const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_PORT = process.env.DB_PORT || 27017;
const DB_NAME = process.env.DB_NAME || "bbttv";
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "root";
const DB_CRED = DB_USER.length > 0 || DB_PASS.length > 0 ? `${DB_USER}:${DB_PASS}@` : "";


export const MONGO_URL = process.env.DB_URL || `mongodb://${DB_CRED}${DB_HOST}:${DB_PORT}/${DB_NAME}${DB_CRED ? "?authSource=admin" : ""}`;

export const PORT = process.env.PORT || 8081;

export const JWT_SECRET = process.env.JWT_SECRET || "POTATO";
export const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN || 604800000; // 5 days
