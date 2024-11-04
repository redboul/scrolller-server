import { LoadAllEntries } from "./services/handlers/load-all-entries/load-all-entries.ts";
import { SaveEntryHandler } from "./services/handlers/save-entry/save-entry.ts";
import { FileRepository } from "./services/repositories/file.ts";

const repository = new FileRepository();
const urlPatterns = [new SaveEntryHandler(repository), new LoadAllEntries(repository)];

async function handler(req: Request): Promise<Response> {
  const handler = urlPatterns.find(handler => handler.match(req));
  if (handler) {
    const response = handler.serve(req);
    if(response){
      return response;
    }
    
  }
  return new Response("Not found (try /books/1)", {
    status: 404,
  });
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  Deno.serve(handler);
}
