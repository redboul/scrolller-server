export interface Repository {
    saveEntry(entry: Entry): void;
    deleteEntry(entry: Entry): void;
    loadAllEntries(type?: string): Promise<Entry[]>;
    mergeDatabase(toMergeName: string);
}

export const ALL_FLAVOR = "all";
export const BLUR_FLAVOR = "blur";
export const SPLIKNOT_FLAVOR = "slipknot";

export interface Entry {
    url: string;
    type?: string;
}