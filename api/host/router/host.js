import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../../app/Exceptions/Exception';
import HostRepository from '../../../app/Repositories/HostRepository';
import { asyncMiddleware } from '../../../midlewares/AsyncMiddleware';
import { Request } from '../../../app/Request';
import ApiResponse from '../../../app/Responses/ApiResponse';
import HostTransformer from '../../../app/Transformers/HostTransformer';
import hasPermission from '../../../midlewares/PermissionMiddleware';
import Permission from '../../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../../midlewares/AuthMiddleware';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getAllServer));
router.get('/:id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getServerById));
router.post('/', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createServer));
router.put('/:id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateServer));
router.delete('/:id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteServer));

async function getAllServer(req, res) {
  try {
    let query = new Request('query').customs(req.query);

    let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
    let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
    let repository = new HostRepository();

    for (let i in query['sort']) {
      repository.orderBy(i, query['sort'][i]);
    }

    if (!_.isNil(query['constraints'])) {
      for (let key in query['constraints']) {
        repository.where(key, query['constraints'][key]);
      }
    }

    if (!_.isNil(query['search'])) {
      _.forEach([], field => {
        repository.orWhere(field, 'like', query['search']);
      });
    }

    let result = await repository.paginate(per_page, page);
    res.json(ApiResponse.paginate(result, new HostTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function getServerById(req, res) {
  try {
    let id = req.params.id;
    let repository = new HostRepository();
    let result = await repository.where('id', id).first();

    if (!result) {
      throw new Error('Host Not Found', 1000);
    }

    res.json(ApiResponse.item(result, new HostTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function createServer(req, res) {
  try {
    let data = {
      name: req.body.name,
      ip: req.body.ip
    };

    let repository = new HostRepository();

    let result = await repository.where('name', data.name).first();

    if (result) {
      throw new Error('Hosts exists', 1000);
    }

    result = await repository.create(data);
    if (!result) {
      throw new Error('Create Hosts false', 1000);
    }

    res.json(ApiResponse.item(result, new HostTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

// async function addSshKey(req, res) {
//     try {
//         let id = req.params.id;
//         let ssh_key = req.body.ssh_key;

//         let data = {
//             host_id: id,
//             ssh_key: ssh_key
//         };

//         let repository = new HostRepository();
//         let host = await repository
//             .with('host_sshkey')
//             .where('id', id)
//             .first();

//         if (!host) {
//             throw new Error('Host not found', 1000);
//         }
//         let sshkey = await host.createHost_sshkey(data);

//         res.json(ApiResponse.item(sshkey, new HostSshKeyTransformer()));
//     } catch (e) {
//         throw new Exception(e.message, 1000);
//     }
// }

// async function deleteSshKey(req, res) {
//     try {
//         let id = req.params.id;
//         let ssh_key_id = req.body.ssh_key_id;

//         let repository = new HostRepository();
//         let host = await repository
//             .with('host_sshkey')
//             .where('id', id)
//             .first();

//         if (!host) {
//             throw new Error('Host not found', 1000);
//         }
//         let sshkey = await host.getHost_sshkeys({
//             where: { id: ssh_key_id }
//         });

//         if (!sshkey[0]) {
//             throw new Error('Host not exists sshkey', 1000);
//         }

//         let result = await sshkey[0].destroy();

//         res.json(ApiResponse.success());
//     } catch (e) {
//         throw new Exception(e.message, 1000);
//     }
// }

async function updateServer(req, res) {
  try {
    let id = req.params.id;
    let data = {
      name: req.body.name,
      ip: req.body.ip
    };

    let repository = new HostRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Hosts not found', 1000);
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

    res.json(ApiResponse.item(result, new HostTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function deleteServer(req, res) {
  try {
    let id = req.params.id;
    let repository = new HostRepository();
    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Hosts Not found', 1000);
    }

    result = await result.destroy();

    if (result === 0) {
      throw new Error('Delete Hosts false', 1000);
    }

    res.json(ApiResponse.success());
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

module.exports = router;
