// Set up server

import express from "express";
import mapRoutes from "./utils/routing/map-routes.js";
import handleErrors from "./utils/routing/handle-errors.js";
import { createServer as createHttpServer } from "http";

// Load environment variables from .env file in development environments

if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv");
    dotenv.config();
}

const app = express();
const httpPort = process.env.HTTP_PORT;

app.use(express.json());

await mapRoutes(app);
handleErrors(app);

const httpServer = createHttpServer(app);
httpServer.listen(httpPort);

console.log(`Server listening to port ${httpPort}`);