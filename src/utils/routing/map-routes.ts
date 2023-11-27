import { Request, Response, Router } from "express";
import { read } from "read-recursive.js"
import path from "path"
import { MappableRouter } from "../../types/utils/mappable-router.js";
import dirname from "../fs/dirname.js";

export default async (router: Router) => {
    const routersPaths = await read(path.join(dirname(import.meta.url), "../", "../", "routers"));

    // Import all found files

    for (let routerPath of routersPaths) {
        // Format URL and replace \ with / since \ is only used by Windows

        routerPath = `file:///${routerPath.replace(/\\/g, "/")}`;

        const mappableRouter: MappableRouter = await import(routerPath).then(mr => mr.router);
        const middlewares = mappableRouter.middlewares?.values() || [];

        router[mappableRouter.method](
            mappableRouter.endpoint,
            ...middlewares,
            mappableRouter.controller
        );
    }

    // Map 404 response

    router.use((req: Request, res: Response) => {
        res.status(404).json({
            code: 404,
            message: "Not found"
        })
    })
}