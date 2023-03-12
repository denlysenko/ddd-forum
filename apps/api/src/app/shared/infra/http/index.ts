import { authService } from '../../../modules/users/services';
import { Hooks } from './utils/Hooks';

const hooks = new Hooks(authService);

export { hooks };
