import { Router } from 'express';
import {
  getAuth,
  loginUser,
  loginUserFromWeb,
  registerUser,
} from '../../controllers/auth/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { updateAccount } from '../../controllers/user/userController';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/web', loginUserFromWeb);
router.get('/get-auth', authMiddleware, getAuth);
router.put(
  '/update-account',
  authMiddleware,
  upload.single('image_url'),
  updateAccount,
);

export default router;
