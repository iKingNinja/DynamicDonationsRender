import { NextFunction, Request, Response } from "express";
import { Middleware } from "../types/utils/mappable-router.js";

const middleware: Middleware = (req: Request, res: Response, next: NextFunction) => {
    // Check if the request includes the API key

    const apiKey = req.headers["x-api-key"];

    if (typeof apiKey !== "string") {
        return res.status(400).json({
            status: 400,
            message: "\"x-api-key\" header must be a string"
        })
    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized"
        })
    }

    next();
}

export default middleware;