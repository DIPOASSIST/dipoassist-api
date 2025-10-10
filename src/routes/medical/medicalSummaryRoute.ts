import { Router } from 'express';
import {
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';
import { getNakesSummary } from '../../controllers/medical/summary/medicalSummaryController';

const router = Router();

router.use(authMiddleware);
router.get('/summary', nakesMiddleware, getNakesSummary);

export default router;
