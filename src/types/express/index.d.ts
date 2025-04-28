import { User } from '../auth/user';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
