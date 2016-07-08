import * as vcf from "vcf";

export class VCFModified extends vcf {
    isNaughty:boolean = false;

    set(k:string,v:string,unusedArg?) {
        if((k.length + v.length + 1) > 72) {
            this.isNaughty = true;

            return console.log("IGNORING: " + k + ":" + v);
        }

        return super.set.apply(this,[k,v,unusedArg]);
    }

    add(k:string,v:string,unusedArg?) {
        if((k.length + v.length + 1) > 72) {
            this.isNaughty = true;

            return console.log("IGNORING: " + k + ":" + v);
        }

        return super.add.apply(this,[k,v,unusedArg]);
    }

    toString(version?:string,charset?:string):string {
        if(this.isNaughty) {return "";}

        return super.toString.apply(this,arguments);
    }
}
