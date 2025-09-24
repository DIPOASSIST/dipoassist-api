import { Router } from 'express';
import {
  getAllUser,
  getDetailUser,
  getUserNakes,
  getUserRoleUser,
} from '../../controllers/user/userController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllUser);
router.get('/:id', adminMiddleware, getDetailUser);
router.get('/nakes', getUserNakes);
router.get('/user', getUserRoleUser);

export default router;
