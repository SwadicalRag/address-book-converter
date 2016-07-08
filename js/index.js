/// <reference path="../typings/index.d.ts" />
"use strict";
var sql = require("sqlite3");
var validator = require("validator");
var vcf_1 = require("./vcf");
var AddressBookConverter = (function () {
    function AddressBookConverter(path) {
        this.path = path;
        this.db = new sql.Database(this.path);
    }
    AddressBookConverter.prototype.start = function (callback) {
        var _this = this;
        this.db.each("select ABPerson.prefix,ABPerson.suffix, ABPerson.first,ABPerson.middle,ABPerson.last, ABMultiValue.value, ABPerson.note, ABPerson.nickname, ABPerson.organization, ABPerson.department, ABPerson.jobtitle, ABPerson.birthday from ABPerson,ABMultiValue where ABMultiValue.record_id=ABPerson.ROWID", function (err, row) {
            if (!err) {
                _this.processRow(row);
            }
        }, function () {
            callback(_this.finalise());
        });
    };
    AddressBookConverter.prototype.getCard = function (first, last, middle) {
        if (first === void 0) { first = ""; }
        if (last === void 0) { last = ""; }
        if (middle === void 0) { middle = ""; }
        this.cardMap[first] = this.cardMap[first] || {};
        this.cardMap[first][last] = this.cardMap[first][last] || {};
        this.cardMap[first][last][middle] = this.cardMap[first][last][middle] || (new vcf_1.VCFModified());
        return this.cardMap[first][last][middle];
    };
    AddressBookConverter.prototype.formatName = function (row) {
        var name = "";
        if (row.Prefix) {
            name += row.Prefix;
            name += " ";
        }
        if (row.First) {
            name += row.First;
            name += " ";
        }
        if (row.Middle) {
            name += row.Middle;
            name += " ";
        }
        if (row.Last) {
            name += row.Last;
            name += " ";
        }
        return name.substr(0, name.length - 1).replace(/[\r\n]/g, "");
    };
    AddressBookConverter.prototype.processRow = function (row) {
        var card = this.getCard(row.First, row.Last, row.Middle);
        card.set("n", ((row.Last || "") + ";" +
            (row.First || "") + ";" +
            (row.Middle || "") + ";" +
            (row.Prefix || "") + ";").replace(/[\r\n]/g, ""));
        card.set("fn", this.formatName(row));
        if (row.Organization) {
            card.set("org", row.Organization.replace(/[\r\n]/g, ""));
        }
        if (row.JobTitle) {
            card.set("title", row.JobTitle.replace(/[\r\n]/g, ""));
        }
        if (row.Note) {
            card.set("note", row.Note.replace(/[\r\n]/g, ""));
        }
        if (row.Nickname) {
            card.set("nickname", row.Nickname.replace(/[\r\n]/g, ""));
        }
        if (row.value) {
            if (validator.isEmail(row.value)) {
                card.add("email", "PREF:" + row.value.replace(/[\r\n]/g, ""));
            }
            else if (row.value.match(/^[\+\d\- \(\)]+$/)) {
                card.add("tel", "CELL:" + row.value.replace(/[\r\n]/g, ""));
            }
            else {
            }
        }
    };
    AddressBookConverter.prototype.forEachCard = function (callback) {
        for (var first in this.cardMap) {
            for (var last in this.cardMap[first]) {
                for (var middle in this.cardMap[first][last]) {
                    callback(this.cardMap[first][last][middle]);
                }
            }
        }
    };
    AddressBookConverter.prototype.finalise = function () {
        var cards = "";
        this.forEachCard(function (card) {
            var cardString = card.toString("2.1");
            if (cardString != "") {
                cards += cardString + "\n";
            }
        });
        cards = cards.replace(/TEL\:/g, "TEL;");
        cards = cards.replace(/EMAIL\:/g, "EMAIL;");
        cards = cards.replace(/\r\n/g, "\n");
        cards = cards.replace(/\n/g, "\r\n");
        return cards;
    };
    return AddressBookConverter;
}());
exports.__esModule = true;
exports["default"] = AddressBookConverter;

//# sourceMappingURL=../maps/index.js.map
