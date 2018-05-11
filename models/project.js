"use strict";
import * as _ from "lodash";
import models from "../models";
import jwt from "jsonwebtoken";
import { Exception } from "../app/Exceptions/Exception";

module.exports = (sequelize, DataTypes) => {
    var Project = sequelize.define(
        "project", {
            name: DataTypes.STRING,
            categories: DataTypes.TEXT,
            framework: DataTypes.TEXT,
            status_id: DataTypes.INTEGER
        }, {
            underscored: true,
            // freezeTableName: true
        }
    );

    Project.associate = models => {
        Project.belongsTo(models.status);
        Project.hasOne(models.build);
        
        Project.addScope('defaultScope', {
            'include': [
                { model: models.status },
                { model: models.build }
            ]
        }, { 'override': true });
    };

    return Project;
};