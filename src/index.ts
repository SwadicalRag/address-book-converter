/// <reference path="../typings/index.d.ts" />

import * as sql from "sqlite3";
import * as validator from "validator";

import {VCFModified} from "./vcf";

export default class AddressBookConverter {
    db:sql.Database;

    constructor(public path) {
        this.db = new sql.Database(this.path);
    }

    start(callback:(cards:string) => void) {
        this.db.each("select ABPerson.prefix,ABPerson.suffix, ABPerson.first,ABPerson.middle,ABPerson.last, ABMultiValue.value, ABPerson.note, ABPerson.nickname, ABPerson.organization, ABPerson.department, ABPerson.jobtitle, ABPerson.birthday from ABPerson,ABMultiValue where ABMultiValue.record_id=ABPerson.ROWID",(err,row) => {
            if(!err) {
                this.processRow(row);
            }
        },() => {
            callback(this.finalise());
        });
    }

    cardMap: {[first: string]: {[last:string]: {[middle:string]: VCFModified}}};
    getCard(first:string = "",last:string = "",middle:string = "") {

        this.cardMap[first] = this.cardMap[first] || {};
        this.cardMap[first][last] = this.cardMap[first][last] || {};
        this.cardMap[first][last][middle] = this.cardMap[first][last][middle] || (new VCFModified());

        return this.cardMap[first][last][middle];
    }

    formatName(row) {
        let name = ""

        if(row.Prefix) {
            name += row.Prefix;
            name += " ";
        }

        if(row.First) {
            name += row.First;
            name += " ";
        }

        if(row.Middle) {
            name += row.Middle;
            name += " ";
        }

        if(row.Last) {
            name += row.Last;
            name += " ";
        }

        return name.substr(0,name.length - 1).replace(/[\r\n]/g,"");
    }

    processRow(row) {
        let card = this.getCard(row.First,row.Last,row.Middle);

        card.set("n",
            (
                (row.Last || "") + ";" + 
                (row.First || "") + ";" + 
                (row.Middle || "") + ";" + 
                (row.Prefix || "") + ";"
            ).replace(/[\r\n]/g,"")
        )

        card.set("fn",
            this.formatName(row)
        )

        if(row.Organization) {
            card.set("org",row.Organization.replace(/[\r\n]/g,""));
        }
        if(row.JobTitle) {
            card.set("title",row.JobTitle.replace(/[\r\n]/g,""));
        }

        if(row.Note) {
            card.set("note",row.Note.replace(/[\r\n]/g,""));
        }

        if(row.Nickname) {
            card.set("nickname",row.Nickname.replace(/[\r\n]/g,""));
        }

        if(row.value) {
            if(validator.isEmail(row.value)) {
                card.add("email","PREF:" + row.value.replace(/[\r\n]/g,""))
            }
            else if(row.value.match(/^[\+\d\- \(\)]+$/)) {
                card.add("tel","CELL:" + row.value.replace(/[\r\n]/g,""))
            }
            else {
            }
        }
    }

    forEachCard(callback:(card:VCFModified) => void) {
        for(let first in this.cardMap) {
            for(let last in this.cardMap[first]) {
                for(let middle in this.cardMap[first][last]) {
                    callback(this.cardMap[first][last][middle]);
                }
            }
        }
    }

    finalise() {
        let cards = "";

        this.forEachCard((card) => {
            let cardString = card.toString("2.1");
            if(cardString != "") {
                cards += cardString + "\n";
            }
        })

        cards = cards.replace(/TEL\:/g,"TEL;");
        cards = cards.replace(/EMAIL\:/g,"EMAIL;");
        cards = cards.replace(/\r\n/g,"\n");
        cards = cards.replace(/\n/g,"\r\n");

        return cards;
    }
}
