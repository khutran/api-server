import * as _ from "lodash";
import express from "express";
import bcrypt from 'bcrypt-nodejs';
import models from "../../../models";
import { Exception } from '../../../app/Exceptions/Exception';
import ProjectRepository from '../../../app/Repositories/ProjectRepository';
import { asyncMiddleware } from "../../../midlewares/AsyncMiddleware";
import CheckSessionMiddleware from "../../../midlewares/CheckSessionMiddleware";
import SingletonService from "../../../app/Services/SingletonService";
import { Request } from "../../../app/Request";
import ApiResponse from "../../../app/Responses/ApiResponse";
import ProjectTransformer from "../../../app/Transformers/ProjectTransformer";
import hasPermission from "../../../midlewares/PermissionMiddleware";
import AvailablePermissions from "../../../app/Configs/AvailablePermissions"
import AuthMiddleware from '../../../midlewares/AuthMiddleware';
import BuildTransformer from '../../../app/Transformers/BuildTransformer';


let router = express.Router();
router.all('*', AuthMiddleware);

router.get('/', asyncMiddleware(getAllProject));
router.get('/:id', asyncMiddleware(getProjectById));
router.post('/', asyncMiddleware(createProject));
router.put('/:id', asyncMiddleware(updateProject));
router.delete('/:id', asyncMiddleware(deleteProject));
router.get('/:id/build', asyncMiddleware(getProjectBuild));
router.post('/:id/build', asyncMiddleware(addProjectBuild));
router.put('/:id/build', asyncMiddleware(updateProjectBuild));
router.delete('/:id/build', asyncMiddleware(deleteProjectBuild));

async function getProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const repository = new ProjectRepository();
    const result = await repository.findById(id);

    const build = await result.getBuild();
    if (!build) {
      throw new Error('Project not craete Build' ,1000);
    }
    res.json(ApiResponse.item(build, new BuildTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function addProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const b = {
      project_id: id,
      host_id: req.body.host_id,
      git: req.body.git,
      git_branch: req.body.git_branch,
      git_key: req.body.git_key,
      git_secret: req.body.git_secret,
      build_auto: req.body.build_auto,
      backup: req.body.backup,
      last_build: new Date()
    }
    const repository = new ProjectRepository();

    const result = await repository.findById(id);

    if (!result) {
      throw new Error('Project not found', 1000);
    }

    let build = await result.getBuild();

    if (!_.isNil(build)) {
      throw new Error('Project build already', 1000);
    }

    build = await result.createBuild(b);

    res.json(ApiResponse.item(build, new BuildTransformer()));

  } catch (e) {
    throw new Exception( e.message, 1000);
  }
}

async function updateProjectBuild(req, res) {
  try {
    const id = req.params.id;
    const b = {
      project_id: id,
      host_id: req.body.host_id,
      git: req.body.git,
      git_branch: req.body.git_branch,
      git_key: req.body.git_key,
      git_secret: req.body.git_secret,
      build_auto: req.body.build_auto,
      backup: req.body.backup
    }

    _.mapKeys(b, (value, key) => {
      if (_.isNil(b[key])) {
        delete b[key];
      }
    })

    const repository = new ProjectRepository();

    let result = await repository.findById(id);

    if (!result) {
      throw new Error('Project not found', 1000);
    }

    let build = await result.getBuild();

    if (_.isNil(build)) {
      throw new Error('Project not create build', 1000);
    }

    build = await build.update(b);

    res.json(ApiResponse.item(build, new BuildTransformer()));
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function deleteProjectBuild(req, res) {
  try {
    const id = req.params.id;

    const repository = new ProjectRepository();

    let result = await repository.findById(id);

    let build = await result.getBuild();

    if (!build) {
      throw new Error('Project not found', 1000);
    }

    await build.destroy();
    res.json(ApiResponse.success());
  } catch (e) {
    throw new Exception(e.message, 1000);
  }
}

async function getAllProject(req, res) {
    try {
        let query = new Request("query").customs(req.query);
        
        let page = _.isUndefined(req.query.page) ? 1 : parseInt(req.query.page);
        let per_page = _.isUndefined(req.query.per_page) ? 10 : parseInt(req.query.per_page);
        let repository = new ProjectRepository();

        for (let i in query['sort']) {
            repository.orderBy(i, query['sort'][i]);
        }

        if (!_.isNil(query['constraints'])) {
            for (let key in query['constraints']) {
                repository.where(key, query['constraints'][key]);
            }
        }

        if (!_.isNil(query['search'])) {
            _.forEach(['name', 'categories', 'framework'], (field) => {
                repository.orWhere(field, 'like', query['search']);
            });
        }

        let result = await repository
            .paginate(per_page, page);
        
        if(_.isEmpty(result.items)){
          throw new Error('not project found', 1000);
        }

        res.json(ApiResponse.paginate(result, new ProjectTransformer(['status'])));
    } catch (e) {
        throw new Exception(e.message, 1000);
    }

}
async function getProjectById(req, res) {
    try {
        let id = req.params.id;
        let repository = new ProjectRepository();
        let result = await repository.findById(id);

        if (!result) {
            throw new Error('Project Not Found', 1000);
        }

        res.json(ApiResponse.item(result, new ProjectTransformer(['build','status'])));
    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

async function createProject(req, res) {

    try {
        let data = {
            name: req.body.name,
            categories: req.body.categories,
            framework: req.body.framework,
            status_id: req.body.status_id
        }

        let repository = new ProjectRepository();

        let result = await repository
            .where('name', data.name)
            .first();

        if (result) {
            throw new Error('Project exists', 1000);
        }

        result = await repository.create(data);
        if (!result) {
            throw new Error('Create Project false', 1000);
        }
        await result.reload();
        res.json(ApiResponse.item(result, new ProjectTransformer(['status'])));

    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

async function updateProject(req, res) {
    try {
        let id = req.params.id;
        let data = {
            name: req.body.name,
            categories: req.body.categories,
            framework: req.body.framework,
            status_id: req.body.status_id
        }

        let repository = new ProjectRepository();
        let result = await repository.findById(id);

        if (!result) {
            throw new Error('Project not found', 1000);
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
        await result.reload();
        res.json(ApiResponse.item(result, new ProjectTransformer(['status'])));

    } catch (e) {
        throw new Exception(e.message, 1000);
    }

}

async function deleteProject(req, res) {

    try {
        let id = req.params.id;
        let repository = new ProjectRepository();
        let result = await repository.findById(id);

        if (!result) {
            throw new Error('Project Not found', 1000);
        }

        result = await result.destroy();

        if (result === 0) {
            throw new Error('Delete Project false', 1000);
        }

        res.json(ApiResponse.success());
    } catch (e) {
        throw new Exception(e.message, 1000);
    }
}

module.exports = router;