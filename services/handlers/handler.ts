export interface Handler {
    match(req: Request): boolean;
    serve(req: Request): Promise<Response> | undefined;
}