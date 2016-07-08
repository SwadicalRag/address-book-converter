"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var vcf = require("vcf");
var VCFModified = (function (_super) {
    __extends(VCFModified, _super);
    function VCFModified() {
        _super.apply(this, arguments);
        this.isNaughty = false;
    }
    VCFModified.prototype.set = function (k, v, unusedArg) {
        if ((k.length + v.length + 1) > 72) {
            this.isNaughty = true;
            return console.log("IGNORING: " + k + ":" + v);
        }
        return _super.prototype.set.apply(this, [k, v, unusedArg]);
    };
    VCFModified.prototype.add = function (k, v, unusedArg) {
        if ((k.length + v.length + 1) > 72) {
            this.isNaughty = true;
            return console.log("IGNORING: " + k + ":" + v);
        }
        return _super.prototype.add.apply(this, [k, v, unusedArg]);
    };
    VCFModified.prototype.toString = function (version, charset) {
        if (this.isNaughty) {
            return "";
        }
        return _super.prototype.toString.apply(this, arguments);
    };
    return VCFModified;
}(vcf));
exports.VCFModified = VCFModified;

//# sourceMappingURL=../maps/vcf.js.map
