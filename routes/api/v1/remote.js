import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
// import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { App } from '../../../app/Services/App';
// import axios from 'axios';
import { Exception } from '../../../app/Exceptions/Exception';
// import { Auth } from '../../..//app/Services/Facades/Auth';
// import jwt from 'jsonwebtoken';
import AxiosTransformer from '../../../app/Transformers/AxiosTransformer';
import { RemoteServer } from '../../../app/Services/RemoteServer';

const router = express.Router();

router.all('*', AuthMiddleware);
router.get('/:id', AsyncMiddleware(get));
router.post('/:id', AsyncMiddleware(clone));
router.put('/:id/pull', AsyncMiddleware(pull));
router.post('/:id/db', AsyncMiddleware(createDb));
router.post('/:id/config', AsyncMiddleware(createConfig));
router.put('/:id/config', AsyncMiddleware(updateConfig));
router.post('/:id/project-manager', AsyncMiddleware(runManager));
router.post('/:id/firts-build', AsyncMiddleware(firtsBuild));
router.post('/:id/replace', AsyncMiddleware(replaceDb));
router.get('/:id/config', AsyncMiddleware(getConfig));
router.get('/:id/info', AsyncMiddleware(info));
router.delete('/:id', AsyncMiddleware(deleteProject));
router.delete('/:id/db', AsyncMiddleware(deleteDb));
router.put('/:id/db', AsyncMiddleware(updateDb));

async function get(req, res) {
  try {
    // let pass = { invalid: false };
    // let user = Auth.user();
    // if (await user.isRole('superadmin')) {
    //   pass['invalid'] = true;
    // }
    // const token = jwt.sign(
    //   {
    //     data: pass
    //   },
    //   process.env.JWT_SECRET,
    //   { expiresIn: 60 }
    // );

    const id = req.params.id;
    const result = await App.make(RemoteServer).checkDomain(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function updateDb(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).updateDb(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function deleteDb(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).deleteDb(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function pull(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).pull(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function deleteProject(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).deleteProject(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function info(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).info(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function getConfig(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).getConfig(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function clone(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).clone(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function createDb(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).createDb(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function createConfig(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).createConfig(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function updateConfig(req, res) {
  try {
    const data = req.body;
    const id = req.params.id;
    const result = await App.make(RemoteServer)
      .addData(data)
      .updateConfig(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    console.log(e);
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function runManager(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).runManager(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function firtsBuild(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).firtsBuild(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

async function replaceDb(req, res) {
  try {
    const id = req.params.id;
    const result = await App.make(RemoteServer).replaceDb(id);

    res.json(ApiResponse.item(result, new AxiosTransformer()));
  } catch (e) {
    throw new Exception(e.response.data.message, e.response.data.error_code);
  }
}

export default router;
