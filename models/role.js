"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Role = sequelize.define(
        "role", {
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            level: DataTypes.INTEGER,
            permissions: DataTypes.JSON,
            description: DataTypes.TEXT
        }, {
            underscored: true,
            // freezeTableName: true
        }
    );

    Role.associate = models => {

    };

    return Role;
};