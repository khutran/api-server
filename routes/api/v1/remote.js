import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { App } from '../../../app/Services/App';
import axios from 'axios';
import { Exception } from '../../../app/Exceptions/Exception';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/:id/clone', AsyncMiddleware(clone));
router.post('/:id/db', AsyncMiddleware(createDb));
router.post('/:id/config', AsyncMiddleware(createConfig));
router.put('/:id/config', AsyncMiddleware(updateConfig));
router.post('/:id/project-manager', AsyncMiddleware(run));
router.post('/:id/firts-build', AsyncMiddleware(firtsBuild));
router.post('/:id/replace', AsyncMiddleware(replaceDb));
router.get('/:id/config', AsyncMiddleware(getConfig));
router.get('/:id/info', AsyncMiddleware(info));
router.delete('/:id', AsyncMiddleware(delete_project));
router.put('/:id/pull', AsyncMiddleware(pull));
router.delete('/:id/db', AsyncMiddleware(deleteDb));

async function deleteDb(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/database?website=${item.name}&status=${item.status.name}`;
    const result = await axios.delete(url, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function pull(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const data_clone = {
      domain: item.name,
      git: item.git_remote,
      branch: item.git_branch,
      key: item.git_application_key,
      secret: item.git_application_secret
    };
    const url = `http://${item.host.name}/${item.framework.name}/build/pull`;
    const result = await axios.put(url, data_clone, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function delete_project(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/build?website=${item.name}&status=${item.status.name}`;
    const result = await axios.delete(url, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function info(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/info?website=${item.name}`;
    const result = await axios.get(url, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function getConfig(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/config?website=${item.name}`;
    const result = await axios.get(url, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function clone(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;
    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);

    const url = `http://${item.host.name}/${item.framework.name}/build/clone`;

    const data_clone = {
      domain: item.name,
      git: item.git_remote,
      branch: item.git_branch,
      key: item.git_application_key,
      secret: item.git_application_secret
    };

    const result = await axios.post(url, data_clone, config_request);

    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function createDb(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);

    const url = `http://${item.host.name}/${item.framework.name}/database/create`;

    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function createConfig(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/config`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function updateConfig(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/config`;

    const db = {
      website: item.name,
      config: {}
    };

    db.config[item.framework.content_config['host']] = item.host.address_mysql;
    db.config[item.framework.content_config['database']] = req.body.db_name;
    db.config[item.framework.content_config['user']] = req.body.user_name;
    db.config[item.framework.content_config['password']] = req.body.password;

    const result = await axios.put(url, db, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function run(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/composer`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function firtsBuild(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/build/buildfirts`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

async function replaceDb(req, res) {
  try {
    const id = req.params.id;
    const authorization = req.headers.authorization;

    const config_request = {
      headers: {
        authorization: authorization
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/database/replace`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(result));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

export default router;
