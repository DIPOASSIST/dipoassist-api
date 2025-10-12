import multer from 'multer';
import { User } from '../auth/user';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
    export interface Multer {
      File: multer.File;
    }
  }
}
