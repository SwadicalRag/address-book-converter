#!/usr/bin/env node

import AddressBookConverter from "./";

import * as fs from "fs";

let args = require("minimist")(process.argv.slice(2));

if(args._[0] && args._[1]) {
    console.log("Converting...")
    let converter = new AddressBookConverter(args._[0]);

    converter.start((cards) => {
        fs.writeFileSync(args._[1],cards);
        console.log("Conversion complete!")
    })
}
else {
    console.log("Usage: convertaddressbook <source/file.sqlite> <target/file.vcf>");
}
