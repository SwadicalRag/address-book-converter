declare class vCard {
    get(key:string):(Object|Array<Object>);
    set(key:string,value:string,params?:Object):void;

    add(key:string,value:string,params?:Object):void;

    setProperty(property:vCard.Property):void;
    addProperty(property:vCard.Property):void;

    parse(value:string):vCard;

    toString(version?:string,charset?:string):string;

    toJSON():any;
}

declare namespace vCard {
    class Property {     
        mimeType():string;
        extension():string;
        versions():Array<string>;
        foldLine():string;
        parseLines():Function;
        normalize(input:string):String
        isSupported(version:string):Boolean
        parse(input:string):vCard;
        parseMultiple(value:string):Array<vCard>;
        fromJSON(jcard:any):vCard;
        format(card:vCard,version:string):String;
    }
}

declare module "vcf" {
    export = vCard;
}
