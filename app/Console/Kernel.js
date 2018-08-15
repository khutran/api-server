import MakeValidatorCommand from './Commands/MakeValidatorCommand';
import MakeMigrationCommand from './Commands/MakeMigrationCommand';
import MakeCommandCommand from './Commands/MakeCommandCommand';
import MakeSeederCommand from './Commands/MakeSeederCommand';
import MakeModelCommand from './Commands/MakeModelCommand';
import MakeRepositoryCommand from './Commands/MakeRepositoryCommand';
import MakeTransformerCommand from './Commands/MakeTransformerCommand';
import CreateRouterCommand from './Commands/CreateRouterCommand';
import UpdateProjectTableDataCommand from './Commands/UpdateProjectTableDataCommand';
import UpdatePermissionGroupCommand from './Commands/UpdatePermissionGroupCommnand';
import UpdateProjectTableBuildtimeAndCloudflareCommand from './Commands/UpdateProjectTableBuildtimeAndCloudflareCommand';

export class Kernel {
  commands() {
    return [
      MakeValidatorCommand,
      MakeMigrationCommand,
      MakeCommandCommand,
      MakeSeederCommand,
      MakeModelCommand,
      MakeRepositoryCommand,
      MakeTransformerCommand,
      CreateRouterCommand,
      UpdateProjectTableDataCommand,
      UpdatePermissionGroupCommand,
      UpdateProjectTableBuildtimeAndCloudflareCommand
    ];
  }
}
