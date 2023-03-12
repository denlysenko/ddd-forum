import { getMemberByUserName } from '../getMemberByUserName';
import { GetCurrentMemberController } from './GetCurrentMemberController';

const getCurrentMemberController = new GetCurrentMemberController(
  getMemberByUserName
);

export { getCurrentMemberController };
