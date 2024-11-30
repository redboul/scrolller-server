import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { ALL_FLAVOR, Repository } from "../../repositories/repository.ts";
import { Handler } from "../handler.ts";


const SAVE_ROUTE = new URLPattern({ pathname: "/entries", search:"type=:type&url=:url" });

export class SaveEntryHandler implements Handler {
    private logger = new Logger();
    constructor(private repository: Repository) {}
    match(req: Request): boolean {
        return SAVE_ROUTE.test(req.url) && req.method === 'POST';
    }
    serve(req: Request) {
        const matcher = SAVE_ROUTE.exec(req.url);
        if(matcher) {
            const id = matcher.search.groups.url;
            const type: string = matcher.search.groups.type;
            this.logger.info(req.url, id, type);
            if(id) {
                this.repository.saveEntry({ url: id, type });
                return Promise.resolve(new Response("ok", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
                    },
                }));
            }
        }
    }
}