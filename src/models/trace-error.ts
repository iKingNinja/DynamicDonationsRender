export default class TraceError extends Error {
    traceId: string;
    
    constructor(err: Error, traceId: string) {
        super();

        this.message = err.message;
        this.name = err.name;
        this.stack = err.stack;
        this.traceId = traceId;
    } 
}