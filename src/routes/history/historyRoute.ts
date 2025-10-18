import { Router } from 'express';
import {
  getAllHistory,
  getAllHistoryByUser,
  getDetailHistory,
} from '../../controllers/history/historyController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllHistory);
router.get('/user/:userId', getAllHistoryByUser);
router.get('/:id', getDetailHistory);

export default router;
