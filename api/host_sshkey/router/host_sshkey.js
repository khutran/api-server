import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import { Exception } from '../../../app/Exceptions/Exception';
import HostSshKeyRepository from '../../../app/Repositories/HostSshKeyRepository';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";
import SingletonService from "../../../app/Services/SingletonService";
import { Request } from "../../../app/Request";
import ApiResponse from "../../../app/Responses/ApiResponse";
import HostSshKeyTransformer from "../../../app/Transformers/HostSshKeyTransformer";

let router = express.Router();

router.get('/', asyncMiddleware(getAllHostSshKey));
router.get('/:id', asyncMiddleware(getHostSshKeyById));
router.post('/', asyncMiddleware(createHostSshKey));
router.put('/:id', asyncMiddleware(updateHostSshKey));
router.delete('/:id', asyncMiddleware(deleteHostSshKey));

async function getAllHostSshKey(req, res) {
    try {
        let query = new Request("query").customs(req.query);

        let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
        let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
        let repository = new HostSshKeyRepository();

        for (let i in query['sort']) {
            repository.orderBy(i, query['sort'][i]);
        }

        if (!_.isNil(query['constraints'])) {
            for (let key in query['constraints']) {
                repository.where(key, query['constraints'][key]);
            }
        }

        if (!_.isNil(query['search'])) {
            _.forEach([], (field) => {
                repository.orWhere(field, 'like', query['search']);
            });
        }

        let result = await repository
            .paginate(per_page, page);

        res.json(ApiResponse.paginate(result, new HostSshKeyTransformer()));
    } catch (e) {
        throw new Exception(e.message, 1000);
    }

}
async function getHostSshKeyById(req, res) {
    try {
        let id = req.params.id;
        let repository = new HostSshKeyRepository();
        let result = await repository.findById(id);
        if (!result) {
            throw new Error('User Not Found', 1000);
        }

        res.json(ApiResponse.item(result, new HostSshKeyTransformer()));
    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

async function createHostSshKey(req, res) {

    try {
        let data = {
            host_id: req.body.host_id,
            ssh_key: req.body.ssh_key
        }

        let repository = new HostSshKeyRepository();

        let result = await repository
            .where('ssh_key', data.ssh_key)
            .first();

        if (result) {
            throw new Error('SshKey exists', 1000);
        }

        result = await repository.create(data);
        if (!result) {
            throw new Error('Create SshKey false', 1000);
        }

        res.json(ApiResponse.item(result, new HostSshKeyTransformer()));

    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

async function updateHostSshKey(req, res) {
    try {
        let id = req.params.id;
        let data = {
            host_id: req.body.host_id,
            ssh_key: req.body.ssh_key
        }

        let repository = new HostSshKeyRepository();
        let result = await repository.findById(id);

        if (!result) {
            throw new Error('SshKey not found', 1000);
        }

        _.mapKeys(data, (value, key) => {
            if (_.isNil(data[key])) {
                delete data[key];
            }
        });

        result = await result.update(data);

        for (let i in data) {
            if (!_.isEqual(data[i], result[i])) {
                throw new Error('Updata false', 1000);
            }
        }

        res.json(ApiResponse.item(result, new HostSshKeyTransformer()));

    } catch (e) {
        throw new Exception(e.message, 1000);
    }

}

async function deleteHostSshKey(req, res) {

    try {
        let id = req.params.id;
        let repository = new HostSshKeyRepository();
        let result = await repository.findById(id);

        if (!result) {
            throw new Error('SshKey Not found', 1000);
        }

        result = await result.destroy();

        if (result === 0) {
            throw new Error('Delete SshKey false', 1000);
        }

        res.json(ApiResponse.success());
    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

module.exports = router;