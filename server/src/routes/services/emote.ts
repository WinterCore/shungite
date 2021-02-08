import * as Sharp         from "sharp";
import * as Path          from "path";
import { file }           from "tmp-promise";
import * as ChildProcess  from "child_process";
import * as Util          from "util";
import { promises as FSP, createWriteStream } from "fs";

const gifsicle: string = require("gifsicle");

import { EMOTE_DIRECTORY, EMOTE_SIZES, EmoteSizeObj, EmoteSize } from "../../config";

import { EmoteType } from "../../database/models/emote";

const execFile  = Util.promisify(ChildProcess.execFile);

export const createMultisizeGifEmote = async (buffer: Buffer): Promise<EmoteSizeObj<string>> => {
    const { path: source, cleanup: cleanupSource } = await file();

    const { width, height } = await Sharp(buffer).metadata();

    if (!width || !height) throw new Error("Couldn't get image metadata");

    let paths: EmoteSizeObj<string> = {};
    await FSP.writeFile(source, buffer);
    for (let size of Object.keys(EMOTE_SIZES) as EmoteSize[]) {
        const { path } = await file();
        const h = EMOTE_SIZES[size as EmoteSize] as number;
        const w = Math.round(width * h / height);
        await execFile(gifsicle, ["-o", path, "--resize", `${w}x${h}`, "--lossy=100", "--colors=100", source]);
        paths[size] = path;
    }
    await cleanupSource();

    return paths;
};

export const createMultisizePngEmote = async (buffer: Buffer): Promise<EmoteSizeObj<string>> => {
    let paths: EmoteSizeObj<string> = {};

    const { width, height } = await Sharp(buffer).metadata();

    if (!width || !height) throw new Error("Couldn't get image metadata");

    await Object.keys(EMOTE_SIZES).reduce((prev, size) => (
        prev.then(() => new Promise(async (resolve, reject) => {
            const { path } = await file();
            const h = EMOTE_SIZES[size as EmoteSize] as number;
            const w = Math.round(width * h / height);
            const writeStream = createWriteStream(path);
            const stream = Sharp(buffer)
                .resize(w, h)
                .png()
                .pipe(writeStream);
            stream.on("finish", () => {
                paths[size as EmoteSize] = path;
                resolve();
            });
            stream.on("error", reject);
        }))
    ), Promise.resolve());

    return paths;
};

export const createMultisizeEmote = async (buffer: Buffer, t: EmoteType) => {
    return t === "gif" ? createMultisizeGifEmote(buffer) : createMultisizePngEmote(buffer);
};

export const storeMultisizeEmote = async (paths: EmoteSizeObj<string>, id: string): Promise<void> => {
    await FSP.mkdir(Path.resolve(EMOTE_DIRECTORY, id));

    for (let size of Object.keys(paths)) {
        await FSP.copyFile(paths[size as EmoteSize] as string, Path.resolve(EMOTE_DIRECTORY, id, size));
    }
};

export const cleanup = async (paths: EmoteSizeObj<string>): Promise<void> => {
    for (let size of Object.keys(paths)) {
        await FSP.unlink(paths[size as EmoteSize] as string);
    }
};

export const processEmote = async (buffer: Buffer, t: EmoteType, id: string) => {
    const paths = await createMultisizeEmote(buffer, t);
    await storeMultisizeEmote(paths, id);
    await cleanup(paths);
};
