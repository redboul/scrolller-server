import { Repository } from "../../repositories/repository.ts";
import { Handler } from "../handler.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";

const LOAD_ALL_ENTRIES_ROUTE = new URLPattern({ pathname: "/entries" });

export class LoadAllEntries implements Handler {
    private logger = new Logger();
    constructor(private repository: Repository) {}
    match(req: Request) {
        return LOAD_ALL_ENTRIES_ROUTE.test(req.url) && req.method === 'GET';
    }
    async serve(_req: Request) {
        this.logger.info('loading all entries');
        const entries = await this.repository.loadAllEntries();
        return Response.json(entries, {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
    }
}