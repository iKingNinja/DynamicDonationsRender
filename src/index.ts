// Set up server

import express from "express";
import mapRoutes from "./utils/routing/map-routes.js";
import handleErrors from "./utils/routing/handle-errors.js";
import { readFileSync } from "fs";
import path from "path";
import { createServer as createHttpServer } from "http";
import { createServer as createHttpsServer } from "https";
import dirname from "./utils/fs/dirname.js";

// Load environment variables from .env file in development environments

if (process.env.NODE_ENV !== "production") {
    const dotenv = await import("dotenv");
    dotenv.config();
}

const app = express();
const httpPort = process.env.HTTP_PORT;
const httpsPort = process.env.HTTPS_PORT;

app.use(express.json());

await mapRoutes(app);
handleErrors(app);

// Configure SSL

const certificatePrivateKey = readFileSync(path.join(dirname(import.meta.url), "../", "ssl", "key.pem"));
const certificate = readFileSync(path.join(dirname(import.meta.url), "../", "ssl", "certificate.pem"));

const httpServer = createHttpServer(app);
const httpsServer = createHttpsServer({
    key: certificatePrivateKey,
    cert: certificate
}, app);

httpServer.listen(httpPort);
httpsServer.listen(httpsPort);

console.log(`Server listening to ports: ${httpPort}, ${httpsPort}`);