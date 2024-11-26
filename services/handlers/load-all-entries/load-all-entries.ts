import { Entry, Repository } from "../../repositories/repository.ts";
import { Handler } from "../handler.ts";
import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";

const LOAD_ALL_ENTRIES_ROUTE = new URLPattern({ pathname: "/entries", search:"type=:type&seed=:seed&page=:page&pageSize=:pageSize" });

export class LoadAllEntries implements Handler {
    private logger = new Logger();
    constructor(private repository: Repository) {}
    match(req: Request) {
        return LOAD_ALL_ENTRIES_ROUTE.test(req.url) && req.method === 'GET';
    }
    getPage(entries: Entry[], seed: number, page: number, pageSize: number) {
      const shuffledEntries = this.shuffle([...entries], seed);
      return shuffledEntries.slice(page * pageSize, (page+1) * pageSize)
    }

    shuffle(entries: Entry[], seed: number) {                // <-- ADDED ARGUMENT
      let m = entries.length;
      let t: Entry;
    
      // While there remain elements to shuffle…
      while (m) {
    
        // Pick a remaining element…
        const i = Math.floor(this.random(seed) * m--);        // <-- MODIFIED LINE
    
        // And swap it with the current element.
        t = entries[m];
        entries[m] = entries[i];
        entries[i] = t;
        ++seed                                     // <-- ADDED LINE
      }
    
      return entries;
    }
    
    random(seed: number) {
      const x = Math.sin(seed++) * 10000; 
      return x - Math.floor(x);
    }

    serve(_req: Request) {
      const matcher = LOAD_ALL_ENTRIES_ROUTE.exec(_req.url);
      if(matcher) {
          const type = matcher.search.groups.type || 'blur';
          const seed = +(matcher.search.groups.seed || 1);
          const page = +(matcher.search.groups.page || 0);
          const pageSize = +(matcher.search.groups.pageSize || 100);
          this.logger.info('loading all entries', type, seed, page, pageSize);
          return this.repository.loadAllEntries()
            .then((entries) => this.getPage(entries, seed, page, pageSize))
            .then((entries) => {
              return Response.json(entries, {
                headers: {
                  "content-type": "application/json",
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS"
                },
              });
            }
          );
        }
    }
}