import { Database } from "jsr:@db/sqlite@0.12";
import { Entry, Repository } from "./repository.ts";

const TABLE_NAME = 'entries';
const URL_COLUMN_NAME = 'url';
const FLAVOR_COLUMN_NAME = 'flavor';
const databasName = "test.db";

function initDB() {
    const db = new Database(databasName);
    db.prepare(
    `
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ${URL_COLUMN_NAME} TEXT UNIQUE,
        ${FLAVOR_COLUMN_NAME} INTEGER
        );
    `,
    ).run();
    db.close();
}

export class SqliteRepository implements Repository {
    constructor() {
        initDB();
    }
    loadAllEntries(): Promise<Entry[]> {
        const db = new Database(databasName);
        try {
            const rows = db.prepare(`SELECT ${URL_COLUMN_NAME} FROM ${TABLE_NAME} where ${FLAVOR_COLUMN_NAME} = ?`).all(0);
            return Promise.resolve(rows.map(row => ({url: row.url})));
        } finally {
            db.close();
        }
    }
    saveEntry(entry: Entry): void {
        const db = new Database(databasName);
        try{
        db.prepare(
            `
                INSERT INTO ${TABLE_NAME} (${URL_COLUMN_NAME}, ${FLAVOR_COLUMN_NAME}) VALUES (?, ?);
            `,
            ).run(entry.url, 0);
        } finally {
            db.close();
        }

    }
}