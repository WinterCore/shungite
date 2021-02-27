import { RequestHandler, Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

export const co = (f: AsyncRequestHandler): RequestHandler =>
    (req, res, next): Promise<void> => f(req, res, next).catch(next);

export const getSortValue = (sort: string | undefined, allowed: string[]): Record<string, -1 | 1>  => {
    if (!sort) return {};

    for (let v of allowed) {
        if (v === sort) {
            return { [sort]: 1 };
        } else if (`-${v}` === sort) {
            return { [sort.slice(1)]: -1 };
        }
    }
    return {};
};

export const clean = <T>(obj: T): T => {
    let res: Partial<T> = {};
    for (let key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            res[key] = obj[key];
        }
    }
    return res as T;
};
