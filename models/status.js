"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Status = sequelize.define(
        "status", {
            name: DataTypes.STRING
        }, {
            underscored: true,
            freezeTableName: true
        }
    );

    Status.associate = models => {
        Status.hasMany(models.project);
    };

    return Status;
};