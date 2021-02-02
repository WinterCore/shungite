import { Request } from "express";

export interface ApiResource<T> {
    (req: Request): (data: T) => any;
}
