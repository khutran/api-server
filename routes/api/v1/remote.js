import express from 'express';
import { AsyncMiddleware } from '../../../app/Middlewares/AsyncMiddleware';
import { AuthMiddleware } from '../../../app/Middlewares/AuthMiddleware';
import ApiResponse from '../../../app/Responses/ApiResponse';
import { App } from '../../../app/Services/App';
// import { Exception } from '../../../app/Exceptions/Exception';
// import { Auth } from '../../..//app/Services/Facades/Auth';
// import jwt from 'jsonwebtoken';
import AxiosRemoteServerTransformer from '../../../app/Transformers/AxiosRemoteServerTransformer';
import { RemoteServer } from '../../../app/Services/RemoteServer';

const router = express.Router();

router.get('/:id/download/database', AsyncMiddleware(downloadDb));
router.get('/:id/download/source', AsyncMiddleware(downloadCode));

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
router.get('/:id/config', AsyncMiddleware(getConfig));

async function downloadCode(req, res) {
  let id = req.params.id;
  await App.make(RemoteServer).downloadCode(id, res);
}

async function downloadDb(req, res) {
  let id = req.params.id;
  await App.make(RemoteServer).downloadDb(id, res);
}

async function get(req, res) {
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

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function updateDb(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).updateDb(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function deleteDb(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).deleteDb(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function pull(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).pull(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function deleteProject(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).deleteProject(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function info(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).info(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function getConfig(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).getConfig(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function clone(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).clone(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function createDb(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).createDb(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function createConfig(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).createConfig(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function updateConfig(req, res) {
  const data = req.body;
  const id = req.params.id;
  const result = await App.make(RemoteServer)
    .addData(data)
    .updateConfig(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function runManager(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).runManager(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function firtsBuild(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).firtsBuild(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

async function replaceDb(req, res) {
  const id = req.params.id;
  const result = await App.make(RemoteServer).replaceDb(id);

  res.json(ApiResponse.item(result, new AxiosRemoteServerTransformer()));
}

export default router;
