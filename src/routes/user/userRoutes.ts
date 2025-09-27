import { Router } from 'express';
import {
  getAllUser,
  getDetailUser,
  getUserByNakes,
  getUserNakes,
  getUserRoleUser,
} from '../../controllers/user/userController';
import {
  adminMiddleware,
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllUser);
router.get('/medical', getUserNakes);
router.get('/patients', getUserRoleUser);
router.get('/medical/list', nakesMiddleware, getUserByNakes);
router.get('/:id', adminMiddleware, getDetailUser);

export default router;
