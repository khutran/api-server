import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { App } from '../../../app/Services/App';
import axios from 'axios';
import { Exception } from '../../../app/Exceptions/Exception';
import { Auth } from '../../..//app/Services/Facades/Auth';
import jwt from 'jsonwebtoken';
import AxiosTransformer from '../../../app/Transformers/AxiosTransformer';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/:id', AsyncMiddleware(get));
router.post('/:id', AsyncMiddleware(clone));
router.put('/:id/pull', AsyncMiddleware(pull));
router.post('/:id/db', AsyncMiddleware(createDb));
router.post('/:id/config', AsyncMiddleware(createConfig));
router.put('/:id/config', AsyncMiddleware(updateConfig));
router.post('/:id/project-manager', AsyncMiddleware(run));
router.post('/:id/firts-build', AsyncMiddleware(firtsBuild));
router.post('/:id/replace', AsyncMiddleware(replaceDb));
router.get('/:id/config', AsyncMiddleware(getConfig));
router.get('/:id/info', AsyncMiddleware(info));
router.delete('/:id', AsyncMiddleware(delete_project));
router.delete('/:id/db', AsyncMiddleware(deleteDb));
router.put('/:id/db', AsyncMiddleware(updateDb));

async function get(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/build`;
    const result = await axios.get(url, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function updateDb(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/database/import`;
    const result = await axios.put(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function deleteDb(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/database?website=${item.name}&status=${item.status.name}`;
    const result = await axios.delete(url, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function pull(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
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
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function delete_project(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/build?website=${item.name}&status=${item.status.name}`;
    const result = await axios.delete(url, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function info(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/info?website=${item.name}`;
    const result = await axios.get(url, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function getConfig(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };
    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/config?website=${item.name}`;
    const result = await axios.get(url, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function clone(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
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

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function createDb(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);

    const url = `http://${item.host.name}/${item.framework.name}/database/create`;

    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function createConfig(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/config`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function updateConfig(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
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
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function run(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/composer`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function firtsBuild(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/build/buildfirts`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function replaceDb(req, res) {
  try {
    let pass = { invalid: false };
    let user = Auth.user();
    if (await user.isRole('superadmin')) {
      pass['invalid'] = true;
    }
    const token = jwt.sign(
      {
        data: pass
      },
      process.env.JWT_SECRET,
      { expiresIn: 60 }
    );

    const id = req.params.id;
    const config_request = {
      headers: {
        authorization: `Bearer ${token}`
      }
    };

    const item = await App.make(ProjectRepository).findById(id);
    const url = `http://${item.host.name}/${item.framework.name}/database/replace`;
    const result = await axios.post(url, { website: item.name }, config_request);
    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

export default router;
