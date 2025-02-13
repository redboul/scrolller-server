import Logger from "https://deno.land/x/logger@v1.1.6/logger.ts";
import { Entry, Repository } from "./repository.ts";
import { appendFile } from "node:fs";

const fileName = "./database.txt";

export class FileRepository implements Repository{
    private logger = new Logger();
    saveEntry(entry: Entry): void {
        appendFile(fileName, `,\n"${entry.url}"`, () => {
            this.logger.info('The "data to append" was appended to file!');
        });
    }
    deleteEntry(entry: Entry): void {
        //TODO
    }
    async loadAllEntries() {
        const content = await Deno.readTextFile(fileName);
        this.logger.info('here is the content', content)
        return (JSON.parse(`[${content}]`) as string[]).map(url => ({url} as Entry))
    }
    mergeDatabase(toMergeName: string) {
}