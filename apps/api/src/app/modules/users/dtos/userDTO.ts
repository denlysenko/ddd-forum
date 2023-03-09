export interface UserDTO {
  readonly username: string;
  readonly isEmailVerified?: boolean;
  readonly isAdminUser?: boolean;
  readonly isDeleted?: boolean;
}
