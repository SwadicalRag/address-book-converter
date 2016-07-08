/// <reference path="../typings/index.d.ts" />
import * as sql from "sqlite3";
import { VCFModified } from "./vcf";
export default class AddressBookConverter {
    path: any;
    db: sql.Database;
    constructor(path: any);
    start(callback: (cards: string) => void): void;
    cardMap: {
        [first: string]: {
            [last: string]: {
                [middle: string]: VCFModified;
            };
        };
    };
    getCard(first?: string, last?: string, middle?: string): VCFModified;
    formatName(row: any): string;
    processRow(row: any): void;
    forEachCard(callback: (card: VCFModified) => void): void;
    finalise(): string;
}
