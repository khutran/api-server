import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { App } from '../../../app/Services/App';
import { Exception } from '../../../app/Exceptions/Exception';
import { RemoteClouflare } from '../../../app/Services/RemoteClouflare';
import AxiosRemoteCloudflareTransformer from '../../../app/Transformers/AxiosRemoteClouflareTransformer';
import CloudflarePermission from '../../../app/Permission/CloudflarePermission';
const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/zones', AsyncMiddleware(getZoneByname));
router.post('/dns', AsyncMiddleware(createDns));
router.put('/dns', AsyncMiddleware(updateDns));
router.get('/dns', AsyncMiddleware(getDetailsOfDns));
router.delete('/dns', AsyncMiddleware(deleteDetails));

async function getDetailsOfDns(req, res) {
  try {
    await new CloudflarePermission().view();
    const name = req.query.name;
    const result = await App.make(RemoteClouflare).getDetailsOfDns(name);

    res.json(ApiResponse.item(result, new AxiosRemoteCloudflareTransformer()));
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
    await new CloudflarePermission().delete();
    const name = req.query.name;

    const result = await App.make(RemoteClouflare).deleteDetails(name);

    res.json(ApiResponse.item(result, new AxiosRemoteCloudflareTransformer()));
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
    await new CloudflarePermission().update();
    const ip = req.body.ip;
    const name = req.query.name;

    const result = await App.make(RemoteClouflare).updateDns(name, ip);

    res.json(ApiResponse.item(result, new AxiosRemoteCloudflareTransformer()));
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
    await new CloudflarePermission().view();
    const name = req.query.name;
    const result = await App.make(RemoteClouflare).getZoneByname(name);

    res.json(ApiResponse.item(result, new AxiosRemoteCloudflareTransformer()));
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
    await new CloudflarePermission().create();
    const name = req.body.name;
    const ip = req.body.ip;
    const result = await App.make(RemoteClouflare).createDns(name, ip);

    res.json(ApiResponse.item(result, new AxiosRemoteCloudflareTransformer()));
  } catch (e) {
    if (!e.error_code) {
      throw new Exception(e.message, 500);
    } else {
      throw new Exception(e.message, e.error_code);
    }
  }
}
export default router;
