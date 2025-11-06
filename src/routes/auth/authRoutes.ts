import { Router } from 'express';
import {
  changePassword,
  confirmResetPassword,
  getAuth,
  loginUser,
  loginUserFromWeb,
  registerUser,
  requestResetPassword,
  verifyOtp,
} from '../../controllers/auth/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';
import { updateAccount } from '../../controllers/user/userController';
import { upload } from '../../middlewares/uploadMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/web', loginUserFromWeb);
router.get('/get-auth', authMiddleware, getAuth);
router.post('/change-password', authMiddleware, changePassword);
router.put(
  '/update-account',
  authMiddleware,
  upload.single('image_url'),
  updateAccount,
);
router.post('/reset', confirmResetPassword);
router.post('/reset/request', requestResetPassword);
router.post('/reset/verify', verifyOtp);

export default router;
