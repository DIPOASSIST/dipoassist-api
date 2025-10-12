import { UpdateUserType } from '../../validator/user/updateUserValidator';

export interface UpdateAccountServiceProps extends UpdateUserType {
  id: string;
  image?: Express.Multer.File | null;
}
