"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Hosts = sequelize.define(
        "host", {
            name: DataTypes.STRING,
            ip: DataTypes.TEXT
        }, {
            underscored: true,
            // freezeTableName: true
        }
    );

    Hosts.associate = models => {
        Hosts.hasMany(models.host_sshkey);
    };

    return Hosts;
};