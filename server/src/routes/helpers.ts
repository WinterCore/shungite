import { RequestHandler, Request, Response, NextFunction } from "express";

type AsyncRequestHandler = (req: Request, res: Response, next ?: NextFunction) => Promise<void>;

export const co = (f: AsyncRequestHandler): RequestHandler =>
    (req, res, next): Promise<void> => f(req, res, next).catch(next);
