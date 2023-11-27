import { NextFunction, Request, Response, Router } from "express";
import { randomBytes } from "crypto"
import TraceError from "../../models/trace-error.js";

export default (router: Router) => {
    // Handlers with 4 arguments are considered error handlers
    // All requests that call next(error) will be routed here

    router.use((err: any, req: Request, res: Response, next: NextFunction) => {
        // Check if the error was caused by invalid Content-Type

        if (err.status === 400) {
            return res.status(400).json({
                status: 400,
                message: "Invalid Content-Type header. Content-Type: application/json is required"
            })
        }
        
        const traceId = randomBytes(25).toString("hex");

        console.log(new TraceError(err, traceId));

        res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            traceId
        })
    })
}