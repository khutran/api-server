import axios from 'axios';
import * as _ from 'lodash';
// import { App } from './App';
import ProjectRepository from '../Repositories/ProjectRepository';
import { App } from './App';
import { Exception } from '../Exceptions/Exception';

export class RemoteServer {
  constructor() {
    this.axios = axios.create();
    this.data = {};
  }

  addData(data) {
    _.assign(this.data, data);
    return this;
  }

  async downloadCode(project_id, res) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();

      const url = `http://${host.name}/${framework.name}/download/source?website=${project.name}`;
      const reponse = await this.axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-disposition', `filename=${project.name}.zip`);
      reponse.data.pipe(res);
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async downloadDb(project_id, res) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();

      const url = `http://${host.name}/${framework.name}/download/database?website=${project.name}`;
      const reponse = await this.axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
      });
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-disposition', `filename=${project.name}.sql`);
      reponse.data.pipe(res);
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async checkDomain(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/build?website=${project.name}`;
      const result = await this.axios.get(url);
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async updateDb(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/database/import`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async deleteDb(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const status = await project.getStatus();
      const url = `http://${host.name}/${framework.name}/database?website=${project.name}&status=${status.name}`;
      const result = await this.axios.delete(url);
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async pull(project_id) {
    try {
      console.log(project_id);
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const data_clone = {
        domain: project.name,
        git: project.git_remote,
        branch: project.git_branch,
        key: project.git_application_key,
        secret: project.git_application_secret
      };
      const url = `http://${host.name}/${framework.name}/build/pull`;
      const result = await this.axios.put(url, data_clone);
      await project.update({ build_time: project.build_time + 1 });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async deleteProject(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const status = await project.getStatus();
      const url = `http://${host.name}/${framework.name}/build?website=${project.name}&status=${status.name}`;
      const result = await this.axios.delete(url);
      await project.update({ build_time: 0 });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async info(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/info?website=${project.name}`;
      const result = await this.axios.get(url);
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async getConfig(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/config?website=${project.name}`;
      const result = await this.axios.get(url);
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async clone(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const data_clone = {
        domain: project.name,
        git: project.git_remote,
        branch: project.git_branch,
        key: project.git_application_key,
        secret: project.git_application_secret
      };
      const url = `http://${host.name}/${framework.name}/build/clone`;
      const result = await this.axios.post(url, data_clone);
      await project.update({ build_time: project.build_time + 1 });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async createDb(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/database/create`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async createConfig(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/config`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async updateConfig(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const db = { website: project.name, config: {} };
      for (let i in this.data) {
        if (i === 'address_mysql') {
          db.config[framework.content_config['host']] = host.address_mysql;
          delete this.data[i];
        }
        if (i === 'user_name') {
          db.config[framework.content_config['user']] = this.data.user_name;
          delete this.data[i];
        }
        if (i === 'db_name') {
          db.config[framework.content_config['database']] = this.data.db_name;
          delete this.data[i];
        }
        if (i === 'password') {
          db.config[framework.content_config['password']] = this.data.password;
          delete this.data[i];
        }
        db.config[i] = this.data[i];
        db.config[framework.content_config['host']] = host.address_mysql;
      }
      const url = `http://${host.name}/${framework.name}/config`;
      const result = await this.axios.put(url, db);
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async runManager(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/composer`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async firtsBuild(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/build/buildfirts`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }

  async replaceDb(project_id) {
    try {
      const project = await App.make(ProjectRepository).findById(project_id);
      const host = await project.getHost();
      const framework = await project.getFramework();
      const url = `http://${host.name}/${framework.name}/database/replace`;
      const result = await this.axios.post(url, { website: project.name });
      return result;
    } catch (e) {
      if (e.response) {
        throw new Exception(e.response.data.message, e.response.data.error_code);
      }
      throw new Exception(e.message, e.error_code);
    }
  }
}
