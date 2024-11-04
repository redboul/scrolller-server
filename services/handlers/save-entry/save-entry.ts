import { Repository } from "../../repositories/repository.ts";
import { Handler } from "../handler.ts";

const SAVE_ROUTE = new URLPattern({ pathname: "/entries", search:"url=:url" });

export class SaveEntryHandler implements Handler {
    constructor(private repository: Repository) {}
    match(req: Request): boolean {
        return SAVE_ROUTE.test(req.url) && req.method === 'POST';
    }
    serve(req: Request) {
        const matcher = SAVE_ROUTE.exec(req.url);
        if(matcher) {
            const id = matcher.search.groups.url;
            if(id) {
                this.repository.saveEntry({ url: id });
                return Promise.resolve(new Response("ok", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }));
            }
        }
    }
}