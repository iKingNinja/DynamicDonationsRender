import { NextFunction, Request, Response, Router } from "express";

type Method =
    "connect" |
    "delete" |
    "get" |
    "head" |
    "options" |
    "patch" |
    "post" |
    "put" |
    "trace" |
    "all"

type Middleware = (req: Request, res: Response, next: NextFunction) => Express.Response | void;

interface MappableRouter {
    method: Method
    endpoint: string
    middlewares?: Set<(req: Request, res: Response, next: NextFunction) => Express.Response | void>;
    controller: (req: Request, res: Response, next: NextFunction) => Express.Response
}