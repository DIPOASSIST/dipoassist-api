import { Request } from 'express';
import { User } from '../auth/user';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
