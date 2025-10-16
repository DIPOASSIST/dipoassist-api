import { Router } from 'express';
import {
  createUser,
  deleteUser,
  generateFcmToken,
  getAllUser,
  getDetailUser,
  getUserByNakes,
  getUserNakes,
  getUserRoleUser,
  resetPassword,
} from '../../controllers/user/userController';
import {
  adminMiddleware,
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllUser);
router.post('/', adminMiddleware, createUser);
router.patch('/generate', generateFcmToken);
router.delete('/:id/delete', adminMiddleware, deleteUser);
router.patch('/:id/reset-password', adminMiddleware, resetPassword);
router.get('/medical', getUserNakes);
router.get('/patients', getUserRoleUser);
router.get('/medical/list', nakesMiddleware, getUserByNakes);
router.get('/:id', getDetailUser);

export default router;
