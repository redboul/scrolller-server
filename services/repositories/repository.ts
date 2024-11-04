export interface Repository {
    saveEntry(entry: Entry): void;
    loadAllEntries(): Promise<Entry[]>;
}

export interface Entry {
    url: string;
}