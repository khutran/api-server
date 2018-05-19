var fs = require('fs');
var path = require('path');
var basename = path.basename(__filename);
import * as _ from "lodash";

export class library {
    constructor(collection) {
        this.collection = collection;
        this.validate = {};
    }

    async validateOfcollection() {
        fs
            .readdirSync(__dirname)
            .filter(file => {
                return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
            })
            .forEach(file => {
                Object.assign(this.validate, require(path.join(__dirname, file)));
            });
    }
}