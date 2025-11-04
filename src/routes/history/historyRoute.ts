import { Router } from 'express';
import {
  getAllHistory,
  getAllHistoryByUser,
  getAllHistoryNoPagination,
  getDetailHistory,
  getSummaryHistory,
} from '../../controllers/history/historyController';
import {
  adminMiddleware,
  authMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllHistory);
router.get('/all', getAllHistoryNoPagination);
router.get('/summary', adminMiddleware, getSummaryHistory);
router.get('/user/:userId', getAllHistoryByUser);
router.get('/:id', getDetailHistory);

export default router;
