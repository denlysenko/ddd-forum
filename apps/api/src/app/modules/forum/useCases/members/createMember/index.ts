import { userRepo } from '../../../../users/repos';
import { memberRepo } from '../../../repos';
import { CreateMember } from './CreateMember';

const createMember = new CreateMember(userRepo, memberRepo);

export { createMember };
