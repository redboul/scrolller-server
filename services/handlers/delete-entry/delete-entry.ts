import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { Repository } from "../../repositories/repository.ts";
import { Handler } from "../handler.ts";

const DELETE_ROUTE = new URLPattern({ pathname: "/entries", search:"url=:url" });

export class DeleteEntryHandler implements Handler {
    private logger = new Logger();
    constructor(private repository: Repository) {}
    match(req: Request): boolean {
        this.logger.info(req.url, 'coucou');
        return DELETE_ROUTE.test(req.url) && ['DELETE', 'OPTIONS'].includes(req.method);
    }
    serve(req: Request) {
        const matcher = DELETE_ROUTE.exec(req.url);
        if(matcher && 'DELETE' === req.method) {
            const id = matcher.search.groups.url;
            this.logger.info(req.url, id);
            if(id) {
                this.repository.deleteEntry({ url: id });
            }
        }
        return Promise.resolve(new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
            },
        }));
    }
}