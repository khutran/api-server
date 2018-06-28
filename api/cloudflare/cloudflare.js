import * as _ from 'lodash';
import express from 'express';
import { Exception } from '../../app/Exceptions/Exception';
import { asyncMiddleware } from '../../midlewares/AsyncMiddleware';
import hasPermission from '../../midlewares/PermissionMiddleware';
import Permission from '../../app/Configs/AvailablePermissions';
import AuthMiddleware from '../../midlewares/AuthMiddleware';
import Error from '../../app/Exceptions/CustomsError';
import axios from 'axios';

let router = express.Router();

router.all('*', AuthMiddleware);

router.get('/zones', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getZoneByname));
router.post('/dns/:zones_id', hasPermission.bind(Permission.ADMIN_CREATE), asyncMiddleware(createDns));
router.put('/dns/:zones_id', hasPermission.bind(Permission.ADMIN_UPDATE), asyncMiddleware(updateDns));
router.get('/dns/:zones_id', hasPermission.bind(Permission.ADMIN_VIEW), asyncMiddleware(getDetailsOfDns));
router.delete('/dns/:zones_id', hasPermission.bind(Permission.ADMIN_DELETE), asyncMiddleware(deleteDetails));

async function getDetailsOfDns(req, res) {
  try {
    const zones_id = req.params.zones_id;
    const name = req.query.name;

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };

    let data = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records?name=${name}`, config);

    if (_.isEmpty(data.data.result)) {
      throw new Error('detail not found', 204);
    }

    res.json({ data: data.data.result });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function deleteDetails(req, res) {
  try {
    const zones_id = req.params.zones_id;
    const name = req.query.name;

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };

    let detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records?name=${name}`, config);

    if (_.isEmpty(detail.data.result)) {
      throw new Error('detail not found', 204);
    }

    let data = await axios.delete(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records/${detail.data.result[0].id}`, config);

    res.json({ data: data.data.result });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function updateDns(req, res) {
  try {
    let name = req.query.name;
    let zones_id = req.params.zones_id;

    const data = {
      type: 'A',
      name: req.body.name,
      content: req.body.ip
    };

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };

    if (_.isNil(data['name']) || _.isNil(data['content'])) {
      throw new Error('name or content not empty', 1000);
    }

    let detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records?name=${name}`, config);

    if (_.isEmpty(detail.data.result)) {
      throw new Error('detail not found', 204);
    }

    let result = await axios.put(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records/${detail.data.result[0].id}`, data, config);

    res.json({ data: result.data.result });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function getZoneByname(req, res) {
  try {
    const name = req.query.name;

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    let data = await axios.get(`https://api.cloudflare.com/client/v4/zones?name=${name}`, config);

    res.json({ data: data.data.result[0] });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

async function createDns(req, res) {
  try {
    let zones_id = req.params.zones_id;

    const config = {
      headers: {
        'X-Auth-Email': process.env.X_Auth_Email,
        'X-Auth-Key': process.env.X_Auth_Key,
        'Content-Type': 'application/json'
      }
    };
    const data = {
      type: 'A',
      name: req.body.name,
      content: req.body.ip,
      ttl: 120,
      priority: 10,
      proxied: false
    };

    let detail = await axios.get(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records?name=${data.name}`, config);

    if (!_.isEmpty(detail.data.result)) {
      throw new Error('detail is exits', 500);
    }

    let result = await axios.post(`https://api.cloudflare.com/client/v4/zones/${zones_id}/dns_records`, data, config);
    res.json({ data: result.data.result });
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}

module.exports = router;
