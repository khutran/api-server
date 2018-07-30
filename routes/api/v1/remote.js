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

    const urlAPI_CLONE = `http://${item.host.name}/${item.framework.name}/build/clone`;

    const data_clone = {
      domain: item.name,
      git: item.git_remote,
      branch: item.git_branch,
      key: item.git_application_key,
      secret: item.git_application_secret
    };

    const clone = await axios.post(urlAPI_CLONE, data_clone, config_request);

    res.json(ApiResponse.getAxios(clone));
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

    const urlAPI_CREATE_DB = `http://${item.host.name}/${item.framework.name}/database/create`;

    const db = await axios.post(urlAPI_CREATE_DB, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(db));
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
    const urlAPI_CREATE_CONFIG = `http://${item.host.name}/${item.framework.name}/config`;
    const config = await axios.post(urlAPI_CREATE_CONFIG, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(config));
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
    const urlAPI_UPDATE_CONFIG = `http://${item.host.name}/${item.framework.name}/config`;

    const db = {
      website: item.name,
      config: {}
    };

    db.config[item.framework.content_config['host']] = item.host.address_mysql;
    db.config[item.framework.content_config['database']] = req.body.db_name;
    db.config[item.framework.content_config['user']] = req.body.user_name;
    db.config[item.framework.content_config['password']] = req.body.password;

    const config = await axios.put(urlAPI_UPDATE_CONFIG, db, config_request);
    res.json(ApiResponse.getAxios(config));
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
    const urlAPI_CREATE_COMPOSER = `http://${item.host.name}/${item.framework.name}/composer`;
    const result = await axios.post(urlAPI_CREATE_COMPOSER, { website: item.name }, config_request);
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
    const urlAPI_RUN_FIRTSBUILD = `http://${item.host.name}/${item.framework.name}/build/buildfirts`;
    const build = await axios.post(urlAPI_RUN_FIRTSBUILD, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(build));
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
    const urlAPI_RUN_REPLACE = `http://${item.host.name}/${item.framework.name}/database/replace`;
    const replace = await axios.post(urlAPI_RUN_REPLACE, { website: item.name }, config_request);
    res.json(ApiResponse.getAxios(replace));
  } catch (e) {
    throw new Exception(ApiResponse.errorAxios(e).message, ApiResponse.errorAxios(e).error_code);
  }
}

export default router;
