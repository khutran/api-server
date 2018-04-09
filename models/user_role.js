"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var User_role = sequelize.define(
        "user_role", {
            user_id: DataTypes.INTEGER,
            role_id: DataTypes.INTEGER
        }, {
            underscored: true,
            freezeTableName: true
        }
    );

    User_role.associate = models => {

    };

    return User_role;
};