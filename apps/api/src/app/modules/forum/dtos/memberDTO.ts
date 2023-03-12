import type { UserDTO } from '../../users/dtos/userDTO';

export interface MemberDTO {
  readonly reputation: number;
  readonly user: UserDTO;
}
