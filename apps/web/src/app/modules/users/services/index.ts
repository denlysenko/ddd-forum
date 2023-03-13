import { AuthService } from './authService';
import { UsersService } from './userService';

const authService = new AuthService();
const usersService = new UsersService(authService);

export { authService, usersService };
