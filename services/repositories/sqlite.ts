import { Database } from "jsr:@db/sqlite@0.12";
import { BLUR_FLAVOR, Entry, Repository, SPLIKNOT_FLAVOR } from "./repository.ts";

const TABLE_NAME = 'entries';
const URL_COLUMN_NAME = 'url';
const FLAVOR_COLUMN_NAME = 'flavor';
const databasName = "test.db";

const flavors = {
    [BLUR_FLAVOR]: 0,
    [SPLIKNOT_FLAVOR]: 1,
}

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
    loadAllEntries(type?: string): Promise<Entry[]> {
        const db = new Database(databasName);
        try {
            let rows;
            if(type) {
                rows = db.prepare(`SELECT ${URL_COLUMN_NAME} FROM ${TABLE_NAME} where ${FLAVOR_COLUMN_NAME} = ?`).all(flavors[type] ?? 0);
            } else {
                rows = db.prepare(`SELECT ${URL_COLUMN_NAME} FROM ${TABLE_NAME}`).all();
            }
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
            ).run(entry.url, flavors[entry.type ?? BLUR_FLAVOR]);
        } finally {
            db.close();
        }
    }
    deleteEntry(entry: Entry): void {
        const db = new Database(databasName);
        try{
        db.prepare(
            `
                DELETE FROM ${TABLE_NAME} WHERE ${URL_COLUMN_NAME} = ?;
            `,
            ).run(entry.url);
        } finally {
            db.close();
        }
    }
}