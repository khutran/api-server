import { Command } from './Command';
import { App } from '../../Services/App';
import ProjectRepository from '../../Repositories/ProjectRepository';
import _ from 'lodash';

export default class UpdateProjectTableDataCommand extends Command {
  signature() {
    return 'update_project_table_data';
  }

  description() {
    return 'Transfer old data from build table to projects table';
  }

  options() {
    // return [{ key: 'option_name?', description: 'The description for option here' }];
  }

  async handle() {
    const projects = await App.make(ProjectRepository)
      .with('build')
      .get();
    const data = _.map(projects, project => _.pick(project.build, ['project_id', 'host_id', 'database', 'git', 'git_branch', 'git_key', 'git_secret', 'build_auto', 'backup']));

    for (let item of projects) {
      const v = _.find(data, i => i.project_id === item.id);
      if (!_.isUndefined(v)) {
        const d = {
          host_id: v.host_id,
          database: v.database,
          git_remote: v.git,
          git_branch: v.git_branch,
          git_application_key: v.git_key,
          git_application_secret: v.git_secret,
          build_automatically: v.build_auto,
          backup: v.backup
        };
        await item.update(d);
      }
    }

    process.exit();
  }
}
