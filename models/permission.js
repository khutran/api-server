"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Permission = sequelize.define(
        "Permission", {
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
        }, {
            underscored: true,
            // freezeTableName: true
        }
    );

    Permission.associate = models => {

    };

    return Permission;
};