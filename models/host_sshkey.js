"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Host_SshKey = sequelize.define(
        "host_sshkey", {
            host_id: DataTypes.INTEGER,
            ssh_key: DataTypes.TEXT
        }, {
            underscored: true,
            freezeTableName: true
        }
    );

    Host_SshKey.associate = models => {
        Host_SshKey.belongsTo(models.host);
    };

    return Host_SshKey;
};