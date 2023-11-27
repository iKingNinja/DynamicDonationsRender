import { fileURLToPath } from "url";

export default (moduleUrl: string): string => fileURLToPath(new URL(".", moduleUrl)); // . means go up one directory