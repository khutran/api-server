import { Command } from './Command';
import { App } from '../../Services/App';
import ProjectRepository from '../../Repositories/ProjectRepository';
import _ from 'lodash';

export default class UpdateProjectTableBuildtimeAndCloudflareCommand extends Command {
  signature() {
    return 'update_project_buildtime_and_cloudflare';
  }

  description() {
    return 'update project buildtime and cloudflare';
  }

  options() {
    // return [{ key: 'option_name?', description: 'The description for option here' }];
  }

  async handle() {
    const projects = await App.make(ProjectRepository).get();

    for (let item of projects) {
      if (_.isNil(item.build_time)) {
        await item.update({ build_time: 1 });
      }
      if (_.isNil(item.cloudflare)) {
        await item.update({ cloudflare: false });
      }
    }

    process.exit();
  }
}
