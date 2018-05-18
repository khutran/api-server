import models from '../../models';
import { Repository } from './Repository';

export default class HostSshKeyRepository extends Repository {
  Models() {
    return models.host_sshkey;
  }
}
