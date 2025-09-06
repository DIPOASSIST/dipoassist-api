import { Router } from 'express';
import {
  getAllUser,
  getDetailUser,
} from '../../controllers/user/userController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllUser);
router.get('/:id', adminMiddleware, getDetailUser);

export default router;
