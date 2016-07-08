import * as vcf from "vcf";
export declare class VCFModified extends vcf {
    isNaughty: boolean;
    set(k: string, v: string, unusedArg?: any): any;
    add(k: string, v: string, unusedArg?: any): any;
    toString(version?: string, charset?: string): string;
}
