import { Router } from 'express';
import {
  deleteSchedule,
  getAllScheduleNakes,
  getAllSchedulePatient,
  updateSchedule,
} from '../../controllers/schedule/scheduleController';
import {
  authMiddleware,
  nakesMiddleware,
} from '../../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);
router.get('/', getAllSchedulePatient);
router.get('/nakes', nakesMiddleware, getAllScheduleNakes);
router.put('/:id', nakesMiddleware, updateSchedule);
router.delete('/:id', nakesMiddleware, deleteSchedule);

export default router;
