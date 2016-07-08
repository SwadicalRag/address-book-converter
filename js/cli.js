#!/usr/bin/env node
"use strict";
var _1 = require("./");
var fs = require("fs");
var args = require("minimist")(process.argv.slice(2));
if (args._[0] && args._[1]) {
    console.log("Converting...");
    var converter = new _1["default"](args._[0]);
    converter.start(function (cards) {
        fs.writeFileSync(args._[1], cards);
        console.log("Conversion complete!");
    });
}
else {
    console.log("Usage: convertaddressbook <source/file.sqlite> <target/file.vcf>");
}

//# sourceMappingURL=../maps/cli.js.map
