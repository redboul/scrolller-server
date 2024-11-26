import { DeleteEntryHandler } from "./services/handlers/delete-entry/delete-entry.ts";
import { LoadAllEntries } from "./services/handlers/load-all-entries/load-all-entries.ts";
import { SaveEntryHandler } from "./services/handlers/save-entry/save-entry.ts";
import { FileRepository } from "./services/repositories/file.ts";
import { SqliteRepository } from "./services/repositories/sqlite.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";

const repository = new SqliteRepository();
const urlPatterns = [new SaveEntryHandler(repository), new LoadAllEntries(repository), new DeleteEntryHandler(repository)];
const logger = new Logger();

async function handler(req: Request): Promise<Response> {
  const handler = urlPatterns.find(handler => handler.match(req));
  if (handler) {
    const response = handler.serve(req);
    if(response){
      return response;
    }
    
  }
  logger.info(req.url);

  return new Response("Not found (try /books/1)", {
    status: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  Deno.serve(handler);
}
