import { Router } from 'express';
import {
  createReport,
  deleteReport,
  getAllReport,
  getAllReportByUser,
  getReportByNakes,
  updateReport,
} from '../../controllers/report/reportController';
import {
  adminMiddleware,
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', adminMiddleware, getAllReport);
router.get('/user', getAllReportByUser);
router.post('/', createReport);
router.put('/:id', updateReport);
router.delete('/:id', deleteReport);
router.get('/medical', nakesMiddleware, getReportByNakes);

export default router;
