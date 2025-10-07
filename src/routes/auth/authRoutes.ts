import { Router } from 'express';
import {
  getAuth,
  loginUser,
  loginUserFromWeb,
  registerUser,
} from '../../controllers/auth/authController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/login/web', loginUserFromWeb);
router.get('/get-auth', authMiddleware, getAuth);

export default router;
