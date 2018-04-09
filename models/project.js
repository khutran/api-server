"use strict";
import * as _ from "lodash";
import models from "../models";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Project = sequelize.define(
        "project", {
            name: DataTypes.STRING,
            host_id: DataTypes.INTEGER,
            categories: DataTypes.TEXT,
            git: DataTypes.TEXT,
            framework: DataTypes.TEXT,
            status_id: DataTypes.INTEGER
        }, {
            underscored: true,
            // freezeTableName: true
        }
    );

    Project.associate = models => {
        Project.belongsTo(models.host);
        Project.belongsTo(models.status);

        Project.addScope('defaultScope', {
            'include': [
                { model: models.host },
                { model: models.status },
            ]
        }, { 'override': true });
    };

    return Project;
};