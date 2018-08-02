import axios from 'axios';
import * as _ from 'lodash';
// import { App } from './App';
import ProjectRepository from '../Repositories/ProjectRepository';
import { App } from './App';

export class RemoteServer {
  constructor() {
    this.axios = axios.create();
    this.data = {};
  }

  addData(data) {
    _.assign(this.data, data);
    return this;
  }

  async checkDomain(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/build`;
    const result = await this.axios.get(url);
    return result;
  }

  async updateDb(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/database/import`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }

  async deleteDb(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const status = await project.getStatus();
    const url = `http://${host.name}/${framework.name}/database?website=${project.name}&status=${status.name}`;
    const result = await this.axios.delete(url);
    return result;
  }

  async pull(project_id) {
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
    const result = await this.axios.post(url, data_clone);
    return result;
  }

  async deleteProject(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const status = await project.getStatus();
    const url = `http://${host.name}/${framework.name}/build?website=${project.name}&status=${status.name}`;
    const result = await this.axios.delete(url);
    return result;
  }

  async info(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/info?website=${project.name}`;
    const result = await this.axios.get(url);
    return result;
  }

  async getConfig(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/config?website=${project.name}`;
    const result = await this.axios.get(url);
    return result;
  }

  async clone(project_id) {
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
    return result;
  }

  async createDb(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/database/create`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }

  async createConfig(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/config`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }

  async updateConfig(project_id) {
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
      // db.config[i] = this.data[i];
      db.config[framework.content_config['host']] = host.address_mysql;
    }
    console.log(db);
    const url = `http://${host.name}/${framework.name}/config`;
    const result = await this.axios.put(url, db);
    return result;
  }

  async runManager(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/composer`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }

  async firtsBuild(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/build/buildfirts`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }

  async replaceDb(project_id) {
    const project = await App.make(ProjectRepository).findById(project_id);
    const host = await project.getHost();
    const framework = await project.getFramework();
    const url = `http://${host.name}/${framework.name}/database/replace`;
    const result = await this.axios.post(url, { website: project.name });
    return result;
  }
}
